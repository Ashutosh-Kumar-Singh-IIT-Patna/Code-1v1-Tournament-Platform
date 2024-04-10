import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleSignup = () => {
    axios.post('http://localhost:5000/api/auth/signup', { name, email, password })
      .then(response => {
        console.log(response.data);
        // Redirect to login page upon successful signup
        navigate('/login'); // Use navigate function to redirect
      })
      .catch(error => {
        console.error('Error signing up:', error);
        // Handle error (e.g., display error message)
      });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required /><br />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /><br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /><br />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Signup;
