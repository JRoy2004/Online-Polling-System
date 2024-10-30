import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ isLoggedin }) => {
  const finalLoginStatus = isLoggedin !== undefined ? isLoggedin : useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };
  return (
    <div className="w-full backdrop-blur-md fixed top-0 z-20">
      <nav className="flex w-full flex-wrap flex-1 items-center justify-between backdrop-blur-md border-b-2">
        <div
          className="glowing pl-4 sm:pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="VoteSwift-logo" />
        </div>
        <div className="w-[25%] font-bold relative right-8 top-2">
          <ul className="flex flex-col sm:flex-row gap-1 items-center justify-between">
            <li className="hover:text-blue-500 text-shadow-lg px-2 glowing cursor-pointer">
              <a onClick={() => navigate("/")}>Home</a>
            </li>
            <li className="hover:text-blue-500 text-shadow-lg px-2 glowing cursor-pointer">
              <a onClick={() => navigate("/dashboard")}>Dashboard</a>
            </li>
            <li className="hover:text-blue-500 text-shadow-lg px-2 glowing cursor-pointer">
              <a onClick={() => navigate("/allpolls")}>Polls</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="flex pl-4 sm:pl-0">
            {finalLoginStatus ? (
              <div className="flex">
                <FaUserCircle
                  className="h-10 w-6 text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => navigate("/update-profile")}
                />
                <button
                  onClick={handleLogout}
                  className="mx-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="mx-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
