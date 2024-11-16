import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.svg";
import Footer from "../components/Footer";

const Verify = () => {
  // Get the token from the URL using useParams
  const { token } = useParams();
  console.log("Token from URL:", token);

  const [status, setStatus] = useState("Verifying...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Function to verify the email with the token
    const verifyEmail = async () => {
      if (!token) {
        setStatus("No token provided.");
        setIsError(true);
        return;
      }

      try {
        // Make a request to your backend API to verify the token
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/verify/${token}`
        );
        console.log("Response:", response.data);

        // If verification is successful
        if (response.status === 200) {
          setStatus(response.data.message || "Verification Successful!");
        } else {
          setStatus(response.data.message || "Verification Failed.");
          setIsError(true);
        }
      } catch (error) {
        console.error("Error during verification:", error);

        // Handle errors gracefully
        const errorMessage =
          error.response?.data?.message ||
          "Verification Failed. Please try again.";
        setStatus(errorMessage);
        setIsError(true);
      }
    };

    // Call the verification function
    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Navbar */}
      <div className="py-4 border-b-2">
        <img src={logo} alt="Logo" className="h-12 mx-auto" />
      </div>

      {/* Verification Status */}
      <div className="verification-container flex flex-col justify-center items-center flex-grow gap-4">
        <h1
          className={`font-semibold text-2xl ${
            isError ? "text-red-500" : "text-green-500"
          }`}
        >
          {status}
        </h1>
        {/* Link to go back to homepage */}
        <Link
          to="/"
          className="text-white backdrop-blur-md bg-blue-500 hover:bg-blue-700 px-6 py-2 font-bold rounded-md mt-4"
        >
          Go to HomePage
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Verify;
