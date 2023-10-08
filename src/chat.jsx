import './style.css';
import React, { useState, useEffect } from 'react';
import { auth, firestore } from './firebase.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
  getDocs,
} from 'firebase/firestore';

function Chat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

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

      const messagesSnapshot = await getDocs(messagesQuery);

      const groupedMessages = {};

      messagesSnapshot.forEach((doc) => {
        const data = doc.data();
        const messageDate = data.timestamp.toDate().toLocaleDateString();

        if (!groupedMessages[messageDate]) {
          groupedMessages[messageDate] = [];
        }

        groupedMessages[messageDate].push(data);
      });

      setMessages(groupedMessages);
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
            profilePicUrl: user.photoURL,
            timestamp: serverTimestamp(),
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
  return (
    <div class='msgs'>
      <div>
        <h2>Welcome, {user ? getUsernameFromEmail(user.email) : 'Guest'}</h2>
      </div>
  
      {Object.entries(messages).map(([date, dateMessages]) => (
        <div  key={date}>
          <h3>{date}</h3>
          {Object.values(dateMessages).map((messageGroup, index) => (
            <div key={index}>
              <p>
                <span className="message-username">{messageGroup.name}:</span>{' '}
                <span className="message-text">{messageGroup.text}</span>{' '}
                <span className="message-time">
                  {messageGroup.timestamp.toDate().toLocaleTimeString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      ))}
  
      {user && (
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      )}
  
      {!user && <h2>Please sign in to send messages.</h2>}
    </div>
  );
  
  
}

export default Chat;
