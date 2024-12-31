import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useDispatch } from "react-redux";
import "../styles/register.css";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../Api";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleInput = (e, name) => {
    const value = e.target.value;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

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
        const response = await api.post("/users/login", data);
        const { accessToken, refreshToken } = response.data?.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        const username = response?.data?.data?.user?.username;
        console.log({ username });

        dispatch(login(username));
        login();
        navigate("/dashboard");
      } catch (error) {
        alert(error?.data?.message);
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <>
      <div className="registerBlock flex items-center justify-center min-h-screen bg-gray-100 py-8">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-center mb-6">Login</h3>

          <form>
            <div className="registerInput mb-4">
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleInput(e, "email")}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div className="registerInput mb-4">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleInput(e, "password")}
              />
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="registerBtn w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              LogIn
            </button>
          </form>

          <button className =  "signup-btn mt-4 text-blue-600 font-semibold hover:bg-blue-700 transition-all"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;

