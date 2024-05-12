import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../css/Login.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth(); // Access the user data from the AuthContext
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem("user");
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSignup = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/auth/signup", { name, email, password })
      .then((response) => {
        console.log(response.data);
        // Redirect to login page upon successful signup
        navigate("/login"); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        // Handle error (e.g., display error message)
      });
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
      <h1 style={{ 
        fontSize: "3rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "2rem",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)"
      }}>Code 1v1 Tournament Platform</h1>
      <div style={{ 
        width: "300px",
        border: "2px solid #fff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        background: "rgba(0, 0, 0, 0.7)",
      }}>
        <h2 style={{ 
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)"
        }}>Sign Up</h2>
        <form onSubmit={handleSignup} style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            style={{ 
              width: "100%",
              marginBottom: "1rem",
              padding: "1rem",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              fontSize: "1rem",
              transition: "box-shadow 0.3s ease",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
            }}
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ 
              width: "100%",
              marginBottom: "1rem",
              padding: "1rem",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              fontSize: "1rem",
              transition: "box-shadow 0.3s ease",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
            }}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ 
              width: "100%",
              marginBottom: "1rem",
              padding: "1rem",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              fontSize: "1rem",
              transition: "box-shadow 0.3s ease",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
            }}
            required
          />
          <button 
            type="submit" 
            style={{ 
              width: "100%",
              padding: "1rem",
              backgroundColor: "#16a085",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              fontSize: "1.2rem",
              fontWeight: "bold",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1abc9c";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#16a085";
              e.target.style.transform = "scale(1)";
            }}
          >
            <span style={{ zIndex: 1 }}>Sign Up</span>
            <span 
              style={{ 
                position: "absolute",
                top: "-10px",
                left: "-10px",
                width: "50px",
                height: "50px",
                background: "#fff",
                borderRadius: "50%",
                animation: "ripple 1s ease infinite",
              }}
            />
          </button>
        </form>
        <p style={{ 
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "1rem",
        }}>
          Already have an account? <a href="/login" style={{ color: "#16a085", textDecoration: "none", fontWeight: "bold" }}>Login</a>
        </p>
      </div>
    </div>
  );
  
};

export default Signup;
