import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import axios from "axios";
import { useAdmin } from "../hooks/useAdmin";
import PollItem from "../components/PollItem";
import getFilteredPolls from "../util/getFilteredPolls";
import SearchUser from "../components/SearchUser";

const AdminControls = () => {
  const { isLoggedin, isAdmin } = useAdmin();
  const [Polls, setPolls] = useState([]);
  const [searchTag, setSearchTag] = useState(""); // For searching by tags
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortCriterion, setSortCriterion] = useState("newest"); //sorting
  const navigate = useNavigate(); // For navigation to create poll page

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/polls`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  const handleDeletePoll = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/polls/${pollId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove poll from the local state after deletion
      setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== pollId));
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };
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

  const filteredPolls = getFilteredPolls(
    Polls,
    searchTag,
    selectedTags,
    filterStatus,
    filterType,
    sortCriterion
  );

  return (
    <div className="min-h-screen bg-gray-100 ">
      <h1
        id="admin"
        className=" pt-[120px] sm:pt-[90px] text-3xl font-bold text-center text-gray-800 mb-4 "
      >
        Admin Controls
      </h1>
      <div className="flex flex-col-reverse lg:flex-row gap-6 justify-center px-4 ">
        <div className="max-w-6xl flex-1">
          <div className="flex flex-col mb-6">
            {/* Tag Search Bar */}
            <div className="flex flex-col md:flex-row sm:justify-between mb-4 gap-2">
              <div className="w-full sm:w-[70%] flex items-center mb-4 sm:mb-0">
                <input
                  type="text"
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  placeholder="Search by tag..."
                  className="w-full h-10 p-2 border min-w-[80px] border-gray-300 rounded-l-lg focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleAddTag}
                  className="bg-green-500 min-w-[70px] text-white p-2 rounded-r-lg w-[120px] hover:bg-green-600 transition duration-200"
                >
                  Add Tag
                </button>
              </div>

              {/* Filter and Sort Options */}
              <div className="flex flex-col sm:flex-row items-start md:justify-center md:ml-4">
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
          <div className="flex flex-col gap-6">
            {filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => (
                <PollItem
                  key={poll._id}
                  poll={poll}
                  handleVote={() => {}} // Placeholder, no need for vote in dashboard
                  hasVoted={true} // Not needed for dashboard
                  showSettingsIcon={false} // Display settings icon on the dashboard
                  allowDelete={true}
                  onDelete={handleDeletePoll} // Pass delete function to PollItem
                  onEdit={() => {}} // Pass edit function to PollItem
                />
              ))
            ) : (
              <p className="text-gray-500 text-center">No polls found.</p>
            )}
          </div>
        </div>
        <div className="max-w-2xl px-4 h-96 flex-1">
          <SearchUser />
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

export default AdminControls;
