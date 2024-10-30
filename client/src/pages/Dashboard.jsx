import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import { FiArrowUp } from "react-icons/fi";
import PollItem from "../components/PollItem";
import { useAuth } from "../hooks/useAuth.js";
import getFilteredPolls from "../util/getFilteredPolls.js";

const Dashboard = () => {
  const isLoggedin = useAuth();
  const [userPolls, setUserPolls] = useState([]);
  const [searchTag, setSearchTag] = useState(""); // For searching by tags
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortCriterion, setSortCriterion] = useState("newest"); //sorting
  const navigate = useNavigate(); // For navigation to create poll page

  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch polls created by the logged-in user
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/polls/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setUserPolls(response.data);
      } catch (error) {
        console.error("Error fetching user polls:", error);
      }
    };

    fetchUserPolls();
  }, []);

  // Delete Poll Function
  const handleDeletePoll = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/polls/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove poll from the local state after deletion
      setUserPolls((prevPolls) =>
        prevPolls.filter((poll) => poll._id !== pollId)
      );
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  // Edit Poll Function: Navigate to the Edit Poll Page
  const handleEditPoll = (pollId) => {
    navigate(`/edit-poll/${pollId}`); // Redirect to the edit poll page with the pollId
  };

  const filteredPolls = getFilteredPolls(
    userPolls,
    searchTag,
    selectedTags,
    filterStatus,
    filterType,
    sortCriterion
  );
  const handleAddTag = () => {
    if (searchTag && !selectedTags.includes(searchTag)) {
      setSelectedTags((prevTags) => [...prevTags, searchTag]);
      setSearchTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto ">
        <h1
          id="admin"
          className="text-3xl  pt-[120px] sm:pt-[90px] font-bold text-center text-gray-800 mb-8"
        >
          My Polls
        </h1>

        {/* Create Poll Button */}
        <div className="flex flex-col mb-8 pl-4">
          <p className="font-semibold pb-2">Want to create a new Poll</p>

          <button
            onClick={() => navigate("/createpoll")} // Redirect to the create poll page
            className="bg-green-500 hover:bg-green-600 text-white py-2 max-w-[200px] px-4 rounded"
          >
            Create Poll
          </button>
        </div>

        {/* Sorting and Searching */}
        <div className="flex flex-col mb-6 sm:pl-4">
          {/* Tag Search Bar */}
          <div className="flex flex-col md:flex-row sm:justify-between mb-4 gap-2">
            <div className="w-full sm:w-[70%] flex items-center mb-4 sm:mb-0">
              <input
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                placeholder="Search by tag..."
                className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="bg-blue-500 text-white p-2 rounded-r-lg w-[120px] hover:bg-blue-600 transition duration-200"
              >
                Add Tag
              </button>
            </div>

            {/* Filter and Sort Options */}
            <div className="flex flex-col sm:flex-row items-center md:justify-center md:ml-4">
              {/* Sorting Dropdown */}
              <select
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value)}
                className="mb-2 sm:mb-0 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostVotes">Most Votes</option>
                <option value="endingSoon">Ending Soon</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mb-2 sm:mb-0 sm:ml-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">Show All Polls</option>
                <option value="expired">Show Expired Polls</option>
                <option value="not-expired">Show Active Polls</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 sm:ml-2"
              >
                <option value="all">All Polls</option>
                <option value="public">Public Polls</option>
                <option value="private">Private Polls</option>
              </select>
            </div>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* List of Polls */}
        <div className="flex flex-col gap-6 sm:pl-4">
          {filteredPolls.length > 0 ? (
            filteredPolls.map((poll) => (
              <PollItem
                key={poll._id}
                poll={poll}
                handleVote={() => {}} // Placeholder, no need for vote in dashboard
                hasVoted={true} // Not needed for dashboard
                showSettingsIcon={true} // Display settings icon on the dashboard
                allowDelete={true}
                onDelete={handleDeletePoll} // Pass delete function to PollItem
                onEdit={handleEditPoll} // Pass edit function to PollItem
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No polls found.</p>
          )}
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

export default Dashboard;
