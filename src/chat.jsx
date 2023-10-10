import './style.css';
import React, { useState, useEffect } from 'react';
import { auth, firestore, signOut } from './firebase.js';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';

function Chat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesCollection = collection(firestore, 'messages');
      const messagesQuery = query(
        messagesCollection,
        orderBy('timestamp', 'asc')
      );

      // Set up a real-time listener
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const groupedMessages = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const messageDate = data.timestamp
            ? data.timestamp.toDate().toLocaleDateString()
            : 'Date Not Available'; // Handle null timestamp

          if (!groupedMessages[messageDate]) {
            groupedMessages[messageDate] = [];
          }

          groupedMessages[messageDate].push(data);
        });

        setMessages(groupedMessages);
      });

      return () => {
        // Unsubscribe from the listener when the component unmounts
        unsubscribe();
      };
    };

    fetchMessages();
  }, []);

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (user) {
      const messagesCollection = collection(firestore, 'messages');

      try {
        if (message.trim() !== '') {
          await addDoc(messagesCollection, {
            name: getUsernameFromEmail(user.email),
            text: message,
            timestamp: new Date(),
            uid: user.uid,
          });
          setMessage('');
        } else {
          alert('Please enter a message before sending.');
        }
      } catch (error) {
        console.error('Error writing new message to Firestore', error);
      }
    } else {
      alert('You must be logged in to send a message.');
    }
  };

  const handleSignOut = async () => {
    if (showLogoutConfirmation) {
      try {
        await signOut(auth);
        setUser(null);
        setShowLogoutConfirmation(false);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      setShowLogoutConfirmation(true);
    }
  };

  return (
    <div className='msgs'>
      <div className='user-info'>
        <div>
          <h2>Welcome, {user ? getUsernameFromEmail(user.email) : 'Guest'}</h2>
        </div>
        {user && (
          <div>
            <button onClick={handleSignOut}>
              {showLogoutConfirmation ? 'Confirm Sign Out' : 'Sign Out'}
            </button>
          </div>
        )}
      </div>

      {Object.entries(messages).map(([date, dateMessages]) => (
        <div className='day' key={date}>
          <h3>{date}</h3>
          {Object.values(dateMessages).map((messageGroup, index) => (
            <div key={index}>
              <p>
                <span className='message-username'>{messageGroup.name}:</span>{' '}
                <span className='message-text'>{messageGroup.text}</span>
                {messageGroup.timestamp && (
                  <span className='message-time'>
                    {messageGroup.timestamp.toDate().toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      ))}

      {user && (
        <form onSubmit={sendMessage}>
          <input
            type='text'
            placeholder='Message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit'>Send</button>
        </form>
      )}

      {!user && <h2 className='caption'>"Please sign in to send messages."</h2>}
    </div>
  );
}

export default Chat;
