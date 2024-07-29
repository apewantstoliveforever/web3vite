//chat box

import React, { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div>
      <h1>Chat</h1>
      <Card>setMessages</Card>
    </div>
  );
};

export default ChatBox;
