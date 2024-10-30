import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FiArrowUp } from "react-icons/fi";
import axios from "axios";
import PollItem from "../components/PollItem";
import { useAuth } from "../hooks/useAuth.js";
import getFilteredPolls from "../util/getFilteredPolls.js";

const AllPolls = () => {
  const isLoggedin = useAuth();
  const [polls, setPolls] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [votedPolls, setVotedPolls] = useState({});
  const [filterVoted, setFilterVoted] = useState("all");

  const navigate = useNavigate(); // For navigation to create poll page

  const [sortCriterion, setSortCriterion] = useState("newest"); //sorting

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

  const handleVote = async (pollId, optionText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/polls/${pollId}/vote`,
        { optionText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refetch polls from the server
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/polls`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the polls state with the newly fetched data
      setPolls(response.data);

      setVotedPolls((prevVotes) => ({
        ...prevVotes,
        [pollId]: optionText,
      }));
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const checkIfVoted = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      const pollResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/polls/${pollId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { votedUsers } = pollResponse.data;

      const userIdResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/getIds`,
        { username }
      );

      const userId = userIdResponse.data.userIds;
      return votedUsers.includes(userId);
    } catch (error) {
      console.error("Error while checking voting eligibility:", error);
    }
  };

  // useEffect to check if the current user has voted in the polls
  useEffect(() => {
    const fetchVotedPolls = async () => {
      const updatedVotedPolls = {};
      for (const poll of polls) {
        const hasVoted = await checkIfVoted(poll._id);
        updatedVotedPolls[poll._id] = hasVoted;
      }
      setVotedPolls(updatedVotedPolls);
    };
    //console.log(votedPolls);
    if (polls.length > 0) {
      fetchVotedPolls();
    }
  }, [polls]);

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
    <div className="min-h-screen bg-gray-100 py-2 ">
      <div className="max-w-6xl mx-auto ">
        <h1
          id="admin"
          className="text-3xl pt-[120px] sm:pt-[90px] font-bold text-center text-gray-800 mb-8"
        >
          All Available Polls
        </h1>

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
              <select
                value={filterVoted}
                onChange={(e) => setFilterVoted(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 sm:ml-2"
              >
                <option value="all">All Polls</option>
                <option value="voted">Polls I've Voted On</option>
                <option value="not-voted">Polls I Haven't Voted On</option>
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

        {/* Poll List */}
        <div className="flex flex-col gap-6 sm:pl-4">
          {getFilteredPolls(
            polls,
            searchTag,
            selectedTags,
            filterStatus,
            filterType,
            sortCriterion,
            votedPolls,
            filterVoted
          ).map((poll) => {
            console.log(poll);
            return (
              <PollItem
                key={poll._id}
                poll={poll}
                showSettingsIcon={false}
                allowDelete={false}
                handleVote={handleVote}
                hasVoted={votedPolls[poll._id]} // Pass the voting status here
              />
            );
          })}
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

export default AllPolls;
