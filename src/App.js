import './style.css'
import React, { useState } from 'react';
import './App.css';
import Login from './login.jsx';
import Chat from './chat.jsx';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleChatClick = () => {
    setShowChat(false);
  };

  const handleAuthSuccess = () => {
    setShowChat(false);
  };

  return (
    <>
      <nav>
        <div className="navbar">
          <div className="navbar-left">
            <a href="#!" onClick={handleChatClick}>
              <h1>CHAT SPACE</h1>
            </a>
          </div>
          <div className="navbar-right">
                {showChat ? (
                  <button onClick={() => setShowChat(false)}>See Chats as Guest</button>
                ) : (
                  <button onClick={() => setShowChat(true)}>Register/Sign In</button>
                )}
          </div>
        </div>
      </nav>
      {showChat ? (
        <ErrorBoundary>
        <Login onAuthSuccess={handleAuthSuccess} />
      </ErrorBoundary>
      ) : (
         <ErrorBoundary>
         <Chat />
       </ErrorBoundary>
      )}
    </>
  );
}

export default App;