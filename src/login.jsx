import './style.css';
import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Login({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignInForm, setIsSignInForm] = useState(true); // Initialize as true for sign-in form

  const showSignInForm = () => {
    setIsSignInForm(true);
  };

  const showRegisterForm = () => {
    setIsSignInForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignInForm) {
      // Sign-in form
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          onAuthSuccess();
        })
        .catch((error) => alert(error.message));
    } else {
      // Registration form
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          onAuthSuccess();
        })
        .catch((error) => alert(error.message));
    }
  };

  return (
    <div className='box'>
      <div className='signin'>
        <button onClick={showSignInForm} disabled={isSignInForm}>
          Sign In
        </button>
        <button onClick={showRegisterForm} disabled={!isSignInForm}>
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {isSignInForm ? (
          <div>
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
            <button type="submit">Sign In</button>
          </div>
        ) : (
          <div>
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
            <button type="submit">Register</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;