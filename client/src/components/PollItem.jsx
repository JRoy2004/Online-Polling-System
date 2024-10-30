import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa"; // Import trash icon from react-icons

const PollItem = ({
  poll,
  handleVote,
  hasVoted,
  showSettingsIcon,
  allowDelete,
  onDelete,
  onEdit,
}) => {
  // Check if the poll is expired
  const isExpired = new Date(poll.expiresAt) < new Date();

  // Calculate total votes to display percentage
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );
  //console.log(poll);

  return (
    <div className="bg-white w-full shadow-md rounded-lg p-4 mb-4 px-8 relative border border-gray-300 flex-1">
      {/* Poll Question */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800">{poll.question}</h2>

        {/* Conditionally render the Edit icon */}

        <div className="flex items-center space-x-2">
          {showSettingsIcon && (
            <div className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
              <FaEdit
                className="text-blue-500 cursor-pointer hover:text-blue-700 w-5 h-5"
                onClick={() => onEdit(poll._id)} // Call the onEdit prop when clicked
                title="Edit Poll"
              />
            </div>
          )}
          {allowDelete && (
            <div className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
              <FaTrash
                className="text-red-500 cursor-pointer hover:text-red-700 "
                onClick={() => onDelete(poll._id)} // Call the onDelete prop when clicked
                title="Delete Poll"
                size={18}
              />
            </div>
          )}
        </div>
      </div>

      {/* Creator name and Expiry date */}
      <div className="text-gray-500 text-xs flex justify-between mt-1">
        {!showSettingsIcon && <p>Created by: {poll.creator.username}</p>}
        <p>Expires at: {new Date(poll.expiresAt).toLocaleDateString()}</p>
      </div>

      {/* Poll Options */}
      <div className="mt-3 space-y-2 pb-2">
        {poll.options.map((option) => {
          const votePercentage =
            totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

          return (
            <div
              key={option._id}
              className={`relative bg-gray-100 hover:bg-gray-300 transition-all rounded-md pl-3 py-1 px-2`}
              onClick={() =>
                !isExpired &&
                !hasVoted &&
                handleVote(poll._id, option.optionText)
              }
              style={{
                pointerEvents: isExpired || hasVoted ? "none" : "auto",
                opacity: isExpired || hasVoted ? 0.7 : 1,
                cursor: isExpired || hasVoted ? "not-allowed" : "pointer",
              }}
            >
              {/* Option Text */}
              <div className="font-medium text-gray-800 text-sm">
                {option.optionText}
              </div>

              {/* Background progress bar */}
              {(hasVoted || showSettingsIcon) && (
                <div
                  className="absolute top-0 left-0 h-full bg-blue-400 rounded-md -z-10"
                  style={{ width: `${votePercentage}%` }}
                ></div>
              )}
              {(hasVoted || showSettingsIcon) && (
                <div className="relative z-10 flex justify-between items-center text-black text-xs mt-1">
                  <span>{`${Math.round(votePercentage)}%`}</span>
                  <span>{`${option.votes} votes`}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* If poll is expired or voted, show message */}
      <div className="mt-2 text-xs text-red-500">
        {isExpired && <p>This poll has expired.</p>}
        {hasVoted && !isExpired && !(allowDelete || showSettingsIcon) && (
          <p>You have already voted.</p>
        )}
      </div>

      {/* Tags at the bottom-right corner */}
      {poll.tags && poll.tags.length > 0 && (
        <div className="absolute bottom-1 right-2 flex flex-wrap space-x-1">
          {poll.tags.map((tag, index) => {
            return (
              tag && (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 border border-green-500 text-xs font-semibold py-1 px-2 rounded-full"
                >
                  {tag}
                </span>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollItem;
