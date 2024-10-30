import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import CreatePoll from "./pages/CreatePoll";
import Dashboard from "./pages/Dashboard";
import EditPoll from "./pages/EditPoll";
import AllPolls from "./pages/AllPolls";
import UpdateUser from "./pages/UpdateUser";
import AdminControls from "./pages/AdminControls";
import UserPage from "./pages/UserPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Error from "./pages/Error";

const AppContent = () => {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/signUp", "/"];

  return (
    <>
      {!hideFooterPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/createpoll" element={<CreatePoll />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allpolls" element={<AllPolls />} />
        <Route path="/edit-poll/:pollId" element={<EditPoll />} />
        <Route path="/update-profile" element={<UpdateUser />} />
        <Route path="/admin-controls" element={<AdminControls />} />
        <Route path="/user/:username" element={<UserPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;