import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const UpdateUser = () => {
  const isLoggedin = useAuth();
  const [oldUsername, setOldUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Assuming you're storing the token in localStorage
  useEffect(() => {
    setOldUsername(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    // console.log(oldUsername, newUsername, email, newPassword, oldPassword);
    try {
      const usernameResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/getIds`,
        {
          username: newUsername,
        }
      );
      if (usernameResponse.data.exists) {
        setError("Username Already Exists. Try something different");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/update-user`,
        {
          oldUsername,
          newUsername,
          newEmail: email,
          newPassword,
          oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("User details updated successfully.");
      alert("User details updated successfully. Please Verify your Email");
      handleLogout();
    } catch (error) {
      setError("Failed to update user details. Please try again.");
      console.error(error);
    }
  };
  return (
    <div className="container w-[100%] px-4 pb-6 flex flex-col justify-center items-center bg-blue-100">
      <div className="p-6  min-h-[100vh] w-[100%] md:w-[70%] lg:w-[50%] bg-white shadow-xl rounded-md sm:mb-4 mt-[130px] sm:mt-[90px]">
        <h2 className="text-2xl font-bold mb-4">Update User Information</h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        {/* Update Username and Email */}
        <form onSubmit={handleUpdate} className="mb-2">
          <div className="mb-4">
            <label
              htmlFor="oldUsername"
              className="block text-gray-700 mb-2 font-semibold"
            >
              Current Username
            </label>
            <input
              type="text"
              id="oldUsername"
              value={oldUsername}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Curent username"
              required
              readOnly
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newUsername"
              className="block text-gray-700 mb-2 font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your new username"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 mb-2 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your new email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="oldpassword"
              className="block text-gray-700 mb-2 font-semibold"
            >
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your current password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 mb-2 font-semibold"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your new password"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2 font-semibold"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 sm:px-10 rounded hover:bg-blue-600 font-semibold"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
