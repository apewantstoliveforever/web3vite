import React, { useState } from 'react';
import { user } from '@/services/gun';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      await user.auth(userName, userPassword);
      onLogin(); // Notify parent component of successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <Input 
        type="text" 
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
        placeholder="Username"
      />
      <Input 
        type="password" 
        value={userPassword} 
        onChange={(e) => setUserPassword(e.target.value)} 
        placeholder="Password"
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
