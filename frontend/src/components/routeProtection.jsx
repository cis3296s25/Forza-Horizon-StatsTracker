import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        // If the token is not present, redirect to the login page
        toast.error("Good try but your attempt failed successfully. First log in");
        return <Navigate to="/profile" replace />;
    }

    return element;
};

export default ProtectedRoute;
