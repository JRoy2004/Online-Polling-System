import React, { useEffect, useState } from "react";

const ErrorPopup = ({ errorMessage, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    const interval = setInterval(() => {
      setProgress((prev) => prev - 0.25);
    }, 7);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center relative">
        <h3 className="text-lg font-bold text-red-600 mb-4">{errorMessage}</h3>

        <div className="h-2 w-full bg-gray-200 rounded-full mb-4">
          <div
            className="bg-blue-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
