import React, { useState } from 'react';
import './App.css';
import Login from './login.jsx';
import Chat from './chat.jsx';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleChatClick = () => {
    setShowChat(true);
  };

  return (
    <>
      <nav>
        <div className="navbar">
          <div className="navbar-left">
            {/* Make the heading clickable */}
            <a href="#!" onClick={handleChatClick}>
              <h1>CHAT SPACE</h1>
            </a>
          </div>
          <div className="navbar-right">
            {showChat ? (
              <button onClick={() => setShowChat(false)}>Login In</button>
            ) : (
              <button onClick={() => setShowChat(true)}>Home</button>
            )}
          </div>
        </div>
      </nav>
      {showChat ? <Chat /> : <ErrorBoundary><Login /></ErrorBoundary>}
    </>
  );
}

export default App;
