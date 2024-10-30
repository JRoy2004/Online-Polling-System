import React, { useState, useRef, useEffect } from "react";

const FormComponent = ({
  formType,
  onSubmit,
  showEmailField,
  checkUnique,
  isUnique,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const usernameRef = useRef(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (formType === "signup" && checkUnique) {
      checkUnique("username", e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "signup") {
      onSubmit({ username, email, password });
    } else {
      onSubmit({ username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-[1rem] font-bold mb-2">
          Username
        </label>
        <input
          ref={usernameRef}
          type="text"
          value={username}
          onChange={handleUsernameChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your username"
          required
        />
        {formType === "signup" && !isUnique.username && (
          <p className="text-red-500">Username already taken</p>
        )}
      </div>

      {showEmailField && (
        <div className="mb-4">
          <label className="block text-gray-700 text-[1rem] font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            required
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 text-[1rem] font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {formType === "signup" ? "Sign Up" : "Login"}
      </button>
    </form>
  );
};

export default FormComponent;
