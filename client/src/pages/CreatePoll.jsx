import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PollForm from "../components/PollForm";
import { useAuth } from "../hooks/useAuth";

const CreatePoll = () => {
  const isLoggedin = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (pollData) => {
    const token = localStorage.getItem("token");
    // console.log(pollData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/polls`,
        pollData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Poll created successfully!");
        navigate("/"); // Redirect to homepage or any other page
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Error creating poll. Please try again.");
    }
  };

  return (
    <PollForm
      pollData={{}}
      onSubmit={handleSubmit}
      isEdit={false}
      isLoggedin={isLoggedin}
    />
  );
};

export default CreatePoll;
