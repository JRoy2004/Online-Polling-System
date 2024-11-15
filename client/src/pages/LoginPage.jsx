import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormComponent from "../components/FormComponent";
import ErrorPopup from "../components/ErrorPopup";

const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      if (response.status === 201 || response.status === 200) {
        if (response.data.user.role === "normal")
          navigate("/"); // Redirect to dashboard
        else if (response.data.user.role === "admin")
          navigate("/admin-controls");
      }
    } catch (error) {
      setError("Invalid credentials or Restricted. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex md:w-[500px] max-w-screen-sm">
      <div className="flex justify-center flex-col bg-slate-200 px-10  shadow-md w-full font-mono">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <FormComponent formType="login" onSubmit={handleLogin} />

        <h3 className="text-center p-4 text-sm font-serif font-semibold">or</h3>
        <div className="font-mono text-sm text-center">
          Don't have an account? &nbsp;
          <Link to="/sign-up" className="text-blue-500 underline">
            Create an account
          </Link>
        </div>

        {error && (
          <ErrorPopup errorMessage={error} onClose={() => setError(null)} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
