import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const PollForm = ({ pollData, onSubmit, isEdit }) => {
  const [question, setQuestion] = useState(pollData.question || "");
  const [options, setOptions] = useState(
    pollData.options || [{ optionText: "" }, { optionText: "" }]
  );
  const [isPublic, setIsPublic] = useState(pollData.isPublic ?? true);
  const [allowedVoters, setAllowedVoters] = useState(
    pollData.allowedVoters || []
  );
  const [message, setMessage] = useState(null);
  const [expiresAt, setExpiresAt] = useState(pollData.expiresAt || "");
  const [tags, setTags] = useState(pollData.tags?.join(",") || "");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], optionText: value };
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, { optionText: "" }]);

  const removeOption = (index) =>
    setOptions(options.filter((_, i) => i !== index));

  const handleAllowedVoters = async (evt) => {
    const voterList = evt.target.value.split(",").map((user) => user.trim());
    const lastVoter = voterList[voterList.length - 1];

    try {
      // Update the allowed voters list immediately
      setAllowedVoters(voterList);

      if (lastVoter) {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/getIds`,
          {
            username: lastVoter,
          }
        );

        const voterSet = new Set(voterList);
        if (voterList.length !== voterSet.size) {
          setMessage("Duplicate Username");
        } else if (!response.data.exists) {
          setMessage("Incorrect username");
        } else {
          setMessage(null); // Clear message if everything is correct
        }

        console.log(response.data, lastVoter);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const optionTexts = options.map((opt) => opt.optionText.trim());
    const uniqueOptions = new Set(optionTexts);

    if (uniqueOptions.size !== optionTexts.length) {
      alert(
        "Poll options must be unique. Please remove or edit duplicate options."
      );
      return;
    }

    onSubmit({
      question,
      options,
      isPublic,
      allowedVoters: isPublic ? [] : allowedVoters,
      expiresAt,
      tags: tags.split(","),
    });
  };

  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center bg-blue-100 pb-8">
      <div className="p-6 mt-[90px] w-full md:w-[70%] lg:w-[50%] bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isEdit ? "Edit Poll" : "Create a Poll"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Poll Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your poll question"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Poll Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 text-red-500"
                >
                  <FaTrash className="w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-white text-2xl bg-blue-500 hover:bg-blue-800 mt-2 w-7 h-7 rounded-full flex items-center justify-center"
            >
              +
            </button>
          </div>

          <div className="mb-4 max-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">
              Poll Type
            </label>
            <select
              value={isPublic ? "public" : "private"}
              onChange={(e) => setIsPublic(e.target.value === "public")}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {!isPublic && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Allowed Voters (comma separated emails)
              </label>
              <input
                type="text"
                value={allowedVoters.join(",")}
                onChange={handleAllowedVoters}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter allowed voters for private poll"
              />
              {message && <p className="text-red-600">{message}</p>}
            </div>
          )}

          <div className="mb-4 max-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="e.g., tech, sports, politics"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md max-w-[200px]  hover:bg-blue-800"
          >
            {isEdit ? "Update Poll" : "Create Poll"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PollForm;
