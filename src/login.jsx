import './style.css';
import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Register a new user
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in an existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" >Log In</button>
      </form>
      
    </div>
  );
}

export default Login;
