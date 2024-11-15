import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.svg";
import Footer from "../components/Footer";

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/verify/${token}`
        );
        console.log(response.data);
        if (response.status === 200 || response.status === 400) {
          setStatus(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);

        setStatus(
          error.response.data.message ||
            "Verification Failed. Please try again."
        );
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className=" flex flex-col justify-between gap-4 min-h-screen">
      <div className="py-2 border-b-2 ">
        <img src={logo} alt="Logo" />
      </div>
      <div className="verification-container flex flex-col justify-center items-center gap-4 ">
        <h1
          className={`font-semibold text-2xl text-${
            status.includes("Successfully") ? "green" : "red"
          }-500`}
        >
          {status}
        </h1>
        <Link
          to="/"
          className="text-white backdrop-blur-md bg-blue-500 hover:bg-blue-700 p-4 font-bold rounded-md mt-4"
        >
          Go to HomePage
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Verify;
