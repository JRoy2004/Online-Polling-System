import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PollForm from "../components/PollForm";
import { useAuth } from "../hooks/useAuth";

const EditPoll = () => {
  const isLoggedin = useAuth();
  const { pollId } = useParams();
  const [pollData, setPollData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/polls/${pollId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPollData(response.data);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchPollData();
  }, [pollId]);

  const handleSubmit = async (updatedPollData) => {
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/polls/${pollId}`,
        updatedPollData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Poll updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating poll:", error);
      alert("Error updating poll. Please try again.");
    }
  };

  if (!pollData) {
    return <div>Loading...</div>;
  }

  return (
    <PollForm
      pollData={pollData}
      onSubmit={handleSubmit}
      isEdit={true}
      isLoggedin={isLoggedin}
    />
  );
};

export default EditPoll;
