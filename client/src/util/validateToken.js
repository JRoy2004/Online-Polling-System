import axios from "axios";
export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/validate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.status);
      return {
        isValid: response.data.isValid,
        userRole: response.data.userRole,
      }; // backend should respond with the token validity
    } catch (error) {
      console.error("Token validation failed", error);
      return { isValid: false };
    }
  }
  return { isValid: false };
};
