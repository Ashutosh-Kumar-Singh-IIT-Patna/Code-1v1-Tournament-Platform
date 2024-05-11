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
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #2980b9, #2c3e50)",
      color: "#fff",
      fontFamily: "'Roboto', sans-serif",
    }}>
      {user && <h1 style={{ 
        fontSize: "3rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "2rem",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)"
      }}>Welcome, {user.name}!</h1>}{" "}

      <div
      style={{
      }}
      >
      <Link to="/create-room" style={{ 
        textDecoration: "none",
        color: "#fff", /* Change text color to white */
        fontSize: "1.5rem",
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
        padding: "1rem",
        backgroundColor: "#16a085",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        display: "inline-block",
        marginBottom: "5rem",
        marginRight: "20rem",
        marginTop: "5rem"
      }} onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#1abc9c";
        e.target.style.transform = "scale(1.05)";
      }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#16a085";
          e.target.style.transform = "scale(1)";
        }}>Create Room</Link>

        <Link to="/join-room" style={{ 
          textDecoration: "none",
          color: "#fff", /* Change text color to white */
          fontSize: "1.5rem",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
          padding: "1rem",
          backgroundColor: "#16a085",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          display: "inline-block",
        }} onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1abc9c";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#16a085";
          e.target.style.transform = "scale(1)";
        }}>Join Room</Link>
      </div>
      <div>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "10rem",
            padding: "1rem",
            backgroundColor: "#e74c3c", // Red color
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            fontSize: "1.2rem",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#c0392b"; // Darker shade of red on hover
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#e74c3c";
            e.target.style.transform = "scale(1)";
          }}
        >
          Logout
        </button>
      </div>

    </div>    
  );
};

export default Home;
