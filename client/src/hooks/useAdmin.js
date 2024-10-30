import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../util/validateToken.js";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { isValid, userRole } = await validateToken();

        setIsLoggedin(isValid);
        setIsAdmin(userRole === "admin");

        // Navigate only if not logged in or not an admin
        if (!isValid || userRole !== "admin") {
          navigate("/login");
        }
      } catch {
        setIsLoggedin(false);
        setIsAdmin(false);
        navigate("/login");
      }
    };
    checkLoginStatus();
  }, [navigate]);

  return { isLoggedin, isAdmin };
};
