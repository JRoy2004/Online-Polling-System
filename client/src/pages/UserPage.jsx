import { useParams } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import axios from "axios";
import PollItem from "../components/PollItem";
import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import Navbar from "../components/Navbar";

const UserPage = () => {
  const { isLoggedin, isAdmin } = useAdmin();
  const { username } = useParams();
  const [user, setUser] = useState(null); // Set initial state to null
  const [pollsData, setPollsData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/getUser/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);

        const pollResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/polls/user/${response.data._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPollsData(pollResponse.data);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [username]);

  const handleDeletePoll = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/polls/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update polls data after deletion
      setPollsData((prevPolls) =>
        prevPolls.filter((poll) => poll._id !== pollId)
      );
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const handleUserAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/users/alterAccess`,
        {
          userId: user._id,
          accessStatus: user.accessStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) window.location.href = window.location.href;
    } catch {
      console.error("Error changing user Access Status:", error);
    }
  };

  if (!user) return <p>Loading...</p>; // Show loading state while user data is being fetched

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center ">
      <Navbar isLoggedin={isLoggedin} />
      <div id="admin"></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 mb-4 mt-[90px]">
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="w-20 h-20 rounded-full shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.username}
              </h1>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-500">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>
            <ul className="text-gray-600">
              <li>
                <span className="font-medium text-gray-800">Email:</span>{" "}
                {user.email}
              </li>
              <li>
                <span className="font-medium text-gray-800">Role:</span>{" "}
                {user.role}
              </li>
              <li>
                <span className="font-medium text-gray-800">Status:</span>{" "}
                {user.accessStatus ? (
                  <span className="text-green-700 font-semibold">active</span>
                ) : (
                  <span className="text-red-700 font-semibold">restricted</span>
                )}
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Activity
            </h2>
            <ul className="text-gray-600">
              <li>
                <span className="font-medium text-gray-800">
                  Polls Created:
                </span>{" "}
                {user.pollsCreated.length}
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Removed Polls:
                </span>{" "}
                {user.removedPollCount}
              </li>
            </ul>
          </div>
        </div>
        <div className="text-white font-semibold mt-4">
          <button
            className={`rounded-md py-2 px-4 ${
              user.accessStatus
                ? "bg-red-500 hover:bg-red-700"
                : "bg-green-500 hover:bg-red-700"
            }`}
            onClick={handleUserAccess}
          >
            {user.accessStatus ? "Restrict" : "Activate"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            All Polls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pollsData.map((poll) => (
              <PollItem
                key={poll._id}
                poll={poll}
                handleVote={() => {}}
                hasVoted={true}
                showSettingsIcon={false}
                allowDelete={true}
                onDelete={handleDeletePoll}
                onEdit={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
      <a
        href="#admin"
        className="bg-blue-500 fixed right-2 bottom-8 p-4 rounded-full text-white font-bold"
      >
        <FiArrowUp size={28} />
      </a>
    </div>
  );
};

export default UserPage;
