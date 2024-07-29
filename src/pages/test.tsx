import React, { useState, useEffect } from 'react';
import { db, user } from '@/services/gun';
import Login from '@/components/test-page-component/login-component'
import Register from '@/components/test-page-component/register-component'
import { Button } from '@/components/ui/button';

const Test: React.FC = () => {
  const [messages, setMessages] = useState<{ id: string, who: string, what: string }[]>([]);
  const [text, setText] = useState<string>('');
  const [logined, setLogined] = useState<boolean>(false);

  const handleLogin = () => {
    setLogined(true);
  };

  const handleRegister = () => {
    setLogined(true);
  };

  useEffect(() => {
    // Listen to user alias changes
    user.get('alias').on((alias) => {
      console.log('alias:', alias);
    });

    // Listen to authentication changes
    db.on('auth', async () => {
      const alias = await user.get('alias');
      console.log('alias:', alias);
      setLogined(true);
    });
    
    // Listen to messages and update state
    const messagesRef = db.get('messages');
    messagesRef.map().on((message, id) => {
      if (message) {
        setMessages((prevMessages) => {
          // Update or add the new message
          const newMessages = prevMessages.filter((msg) => msg.id !== id);
          newMessages.push({ id, ...message });
          return newMessages;
        });
      }
    });

    // Cleanup on unmount
    return () => {
      messagesRef.map().off();
      db.off('auth');
    };
  }, []);

  return (
    <div>
      {logined ? (
        <div>Logged in</div>
      ) : (
        <div>
          <div className='text-red-600'>
            color
          </div>
          <Login onLogin={handleLogin} />
          <h2>Register</h2>
          <Register onRegister={handleRegister} />
        </div>
      )}
    </div>
  );
};

export default Test;
