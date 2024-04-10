import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate ,} from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  // const history =  useHistory();

  const handleLogin = async () => {
    try {
      console.log("hi1");
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log("hi2");
      console.log(response.data);
      // history.push('/home')
      // Redirect to the home page upon successful login
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error (e.g., display error message)
    }
  };
  

  return (
    <div>
      <h1>Login</h1>
      <form >
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /><br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /><br />
        <button type="submit" onClick={handleLogin}>Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

export default Login;
