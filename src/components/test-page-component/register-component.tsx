import React, { useState } from "react";
import { user } from "@/services/gun";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");

  const handleRegister = async () => {
    try {
      console.log("Registering...", userName, userPassword);
      await user.create(userName, userPassword, () => {
        console.log("Registered:", userName + " " + userPassword);
        localStorage.setItem("username", userName);
        localStorage.setItem("password", userPassword);
      });
      // onRegister(); // Notify parent component of successful registration
    } catch (error) {
      console.error("Registration failed:", error);
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
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;
