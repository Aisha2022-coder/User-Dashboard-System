import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register.tsx';
import Login from './components/logIn.tsx';
import Dashboard from './components/Dashboard.tsx';
import Home from './components/Home.tsx';
import { AuthProvider } from './components/AuthContext.js'; 


const AppRoutes = () => (
    <AuthProvider>
    <Router>
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quote" element={<Home />} />
            
        </Routes>
    </Router>
    </AuthProvider>
);

export default AppRoutes;
