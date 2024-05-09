import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Access the login function directly from the AuthContext
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem("user");
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      const userData = response.data;
      login(userData); // Set user data in the context
      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response.status === 401) {
        // Invalid email or password
        alert("Invalid email or password!");
      } else {
        // Other error (e.g., server error)
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h1>Welcome to Code 1v1 Platform!</h1>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
