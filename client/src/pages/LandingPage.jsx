import React, { useState, useEffect } from "react";
import { contents } from "../Constants";
import { validateToken } from "../util/validateToken.js";
import Navbar from "../components/Navbar.jsx";
import BodyComponent from "../components/BodyComponent.jsx";
import Footer from "../components/Footer.jsx";

const LandingPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { isValid } = await validateToken(); // Validate the token

        setIsLoggedin(isValid); // Set state based on token validity
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedin(false); // Handle error case
      }
    };

    checkLoginStatus(); // Call the async function
  }, []); // Only run on mount

  // Show the regular landing page for unauthenticated users
  return (
    <div className="">
      <Navbar isLoggedin={isLoggedin} />

      <div className="pt-[100px] sm:pt-[90px] ">
        {/* <Hero />
        <ManagePolls />
        <PollSection /> */}
        <BodyComponent {...contents[0]} isLoggedin={isLoggedin} />
        <BodyComponent {...contents[1]} rev color isLoggedin={isLoggedin} />
        <BodyComponent {...contents[2]} isLoggedin={isLoggedin} />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
