import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../util/validateToken.js";

export const useAuth = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { isValid } = await validateToken();
        setIsLoggedin(isValid);
        if (!isValid) navigate("/login");
      } catch {
        setIsLoggedin(false);
        navigate("/");
      }
    };
    checkLoginStatus();
  }, [navigate]);

  return isLoggedin;
};
