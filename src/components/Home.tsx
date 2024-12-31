import React, { useEffect, useState } from "react";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const color = ["skyblue", "lightgrey", "rgb(199, 157, 17)"];

  const fetchQuote = async () => {
    try {
      const response = await api.get("/public/quotes");
      setJokes(response.data?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");  
    } else {
      fetchQuote();  
    }
  }, [isAuthenticated, navigate]);

  console.log({ error });

  if (loading) return <p>Loading...</p>;

  console.log({ jokes });

  return (
    <div className="mt-3">
      <h1 className="ms-5"> Quotes</h1> 
      <ul className="mx-5" style={{ listStyleType: "none" }}>
        {jokes?.map((joke: any, index) => (
          <li
            className="p-3 mb-4"
            key={index}
            style={{ backgroundColor: `${color[index % 3]}` }}
          >
            {joke?.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
