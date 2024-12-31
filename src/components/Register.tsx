import React, { useState } from "react";
import "../styles/register.css"; 
import { useNavigate } from "react-router-dom";
import api from "../Api";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInput = (e, name) => {
    const value = e.target.value;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateUsername = (username) => username === username.toLowerCase();
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!data.username) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      valid = false;
    } else if (!validateUsername(data.username)) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be in lowercase",
      }));
      valid = false;
    }

    if (!data.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      valid = false;
    } else if (!validateEmail(data.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      valid = false;
    }

    if (!data.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      valid = false;
    } else if (!validatePassword(data.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long, contain at least one number and one uppercase letter",
      }));
      valid = false;
    }

    if (valid) {
      try {
        const response = await api.post("/users/register", data);
        console.log(response.data);
        if (response.status === 201) {
          alert("User registered");
          navigate("/login");
        }
      } catch (error) {
        alert(
          "Error: " + (error.response ? error.response.data : error.message)
        );
      }
    }
  };

  return (
    <div className="registerBlock">
      <h3 className="text-2xl font-bold text-center mb-6">Signup</h3>
      <form>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="registerInput"
            onChange={(e) => handleInput(e, "username")}
          />
          {errors.username && (
            <div className="text-red-500 text-sm">{errors.username}</div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="registerInput"
            onChange={(e) => handleInput(e, "email")}
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter your password"
            className="registerInput"
            onChange={(e) => handleInput(e, "password")}
          />
          {errors.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="registerBtn"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Register;

