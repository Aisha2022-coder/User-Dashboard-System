import React, { useEffect, useState } from "react";
import api from "../Api";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const { isAuthenticated, logout } = useAuth();
  const user = useSelector((state: any) => state.auth.user);

  const color = ["lightgreen", "darkbrown", "rgb(25, 113, 129)"];

  const fetchJokes = async () => {
    try {
      const response = await api.get("/public/randomjokes");
      setJokes(response.data?.data?.data);

      setLoading(false);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error: " + (error.response ? error.response.data : error.message));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsEditing(false);
      console.log("Profile updated:", profile);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  console.log({ error });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchJokes();
    }
  }, [isAuthenticated, navigate]);

  if (loading) return <p>Loading...</p>;

  console.log({ jokes });

  return (
    <>
      <h1 className="px-5 mt-3 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">Welcome, {user} ! </h1>
      <div>
        <div className="flex items-center justify-between m-4 p-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 mx-5 my-4 drop-shadow-lg">
            Random Jokes
          </h1>
          <button
            onClick={() => navigate('/quote')}
            className="ms-auto me-3 py-2 px-3"
            style={{
              backgroundColor: "skyblue",
              border: "none",
              borderRadius: "5px",
              width: "140px",
              fontWeight: 700,
            }}
          >
            Quotes
          </button>
          <button
            onClick={handleLogout}
            className="col-2 py-2 px-3"
            style={{
              backgroundColor: "skyblue",
              border: "none",
              borderRadius: "5px",
              width: "140px",
              fontWeight: 700,
            }}
          >
            Log Out
          </button>
        </div>

        {/* Profile Update Section */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue text-black py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-blue">{profile.name}</p>
              <p className="text-blue">{profile.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-400 text-black py-2 px-4 rounded-lg hover:bg-yellow-500 transition"
                style ={{
                  backgroundColor: "skyblue",
                  border: "none",
                  borderRadius: "5px",
                  width: "140px",
                  fontWeight: 700,
                  marginLeft: "10px"
                }}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <ul className="mx-5" style={{ listStyleType: "none" }}>
          {jokes?.map((joke: any, index) => (
            <li
            className={`p-4 rounded-lg shadow-md text-center transition-all duration-300 ${color[index % 3]} text-blue`}
              key={index}
              style={{
                backgroundColor: `${color[index % 3]}`,
                fontWeight: "500",
              }}
            >
              {joke?.content}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
