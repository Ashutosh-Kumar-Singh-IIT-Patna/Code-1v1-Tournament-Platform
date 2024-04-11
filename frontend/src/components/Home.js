import React, { useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import useAuth hook from AuthContext
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate hook from react-router-dom

const Home = () => {
  let { user, logout } = useAuth(); // Access user data and logout function from context
  const navigate = useNavigate(); // Get navigate function from react-router-dom

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    // Check if user data exists in context
    if (!user) {
      // If user data does not exist, redirect to login page
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // Call logout function to clear user session data
    logout();
    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div>
      {user && <h1>Welcome, {user.name}!</h1>}{" "}
      {/* Display username if available */}
      <div>
        <Link to="/create-room">Create Room</Link>
      </div>
      <div>
        <Link to="/join-room">Join Room</Link>
      </div>
      <div>
        {/* Logout link */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
