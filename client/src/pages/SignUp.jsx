import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormComponent from "../components/FormComponent";

const SignUp = () => {
  const [error, setError] = useState(null);
  const [isUnique, setIsUnique] = useState({ username: true });
  const navigate = useNavigate();

  const checkUnique = async (field, value) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/user/check-unique`,
        {
          field,
          value,
        }
      );
      setIsUnique((prevState) => ({
        ...prevState,
        [field]: response.data.unique,
      }));
    } catch (error) {
      console.error("Error checking uniqueness", error);
    }
  };

  const handleSignUp = async ({ username, email, password }) => {
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          username,
          email,
          password,
        }
      );
      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(
          error.response.data.message || "Signup failed. Please try again."
        );
      } else {
        setError("Signup failed. Please check your input and try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex md:w-[500px] max-w-screen-sm">
      <div className="flex justify-center flex-col bg-slate-200 px-10  shadow-md w-full font-mono">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <FormComponent
          formType="signup"
          onSubmit={handleSignUp}
          showEmailField={true}
          checkUnique={checkUnique}
          isUnique={isUnique}
        />
        <h3 className="text-center p-4 text-sm font-serif font-semibold">or</h3>
        <div className="font-mono text-sm text-center">
          Already have an account? &nbsp;
          <Link to="/login" className="text-blue-500 underline">
            Login here
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
