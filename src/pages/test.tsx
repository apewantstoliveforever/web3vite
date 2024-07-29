import React, { useState, useEffect, useRef } from "react";
import { db, user } from "@/services/gun";
import Login from "@/components/test-page-component/login-component";
import Register from "@/components/test-page-component/register-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  who: string;
  what: string;
  timestamp: number; // Unix timestamp in milliseconds
}

const Test: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const [logined, setLogined] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>("room1"); // Default room

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<any>(null); // For keeping track of the current message reference

  const handleLogin = () => {
    setLogined(true);
    user.get("alias").then((alias: string) => setUsername(alias));
  };

  const handleRegister = () => {
    setLogined(true);
    user.get("alias").then((alias: string) => setUsername(alias));
  };

  useEffect(() => {
    // Check local storage
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      user.auth(storedUsername, storedPassword);
    }

    const aliasRef = user.get("alias");
    aliasRef.on((alias: string) => {
      setUsername(alias);
    });

    db.on("auth", async () => {
      const alias = await user.get("alias");
      setLogined(true);
      setUsername(alias);
    });

    return () => {
      // Cleanup on unmount
      if (messagesRef.current) {
        messagesRef.current.map().off();
      }
      db.off("auth");
    };
  }, []);

  useEffect(() => {
    // Handle message subscription for the current room
    if (messagesRef.current) {
      console.log("Unsubscribing from messages in room", currentRoom);
      messagesRef.current.map().off(); // Unsubscribe from previous room
    }

    console.log("Subscribing to messages in room", currentRoom);
    messagesRef.current = db.get(`rooms/${currentRoom}/messages`);
    messagesRef.current.map().on((message: any, id: any) => {
      if (message) {
        setMessages((prevMessages) => {
          const newMessages = prevMessages.filter((msg) => msg.id !== id);
          newMessages.push({ id, ...message });
          return newMessages;
        });
      }
    });

    // Cleanup on room change
    return () => {
      if (messagesRef.current) {
        // messagesRef.current.map().off();
        // console.log('sss', messagesRef.current.map())
        db.get(`rooms/${currentRoom}/messages`).off();
      }
    };
  }, [currentRoom]);

  const ClearAllChat = async () => {
    if (messagesRef.current) {
      const messages = await messagesRef.current.map().once();
      Object.keys(messages).forEach((id) => {
        messagesRef.current.get(id).put(null);
      });
      console.log("All chat messages cleared.");
    }
  };

  const handleLogout = () => {
    user.leave();
    setLogined(false);
    setUsername(null);
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  };

  const handleSendMessage = () => {
    if (username) {
      db.get(`rooms/${currentRoom}/messages`).set({
        who: username,
        what: text,
        timestamp: Date.now(), // Current time in milliseconds
      });
      setText(""); // Clear the input after sending
    } else {
      console.error("Username is not set");
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); // Formats the time as HH:MM:SS
  };

  return (
    <div>
      {logined ? (
        <div>
          <h2>Welcome {username}</h2>
          <Button onClick={handleLogout}>Logout</Button>
          <Button onClick={ClearAllChat}>Clear All Chat</Button>

          {/* Room selection */}
          <div>
            <Button
              onClick={() => {
                if (currentRoom !== "room1") {
                  setMessages([]); // Clear messages for the old room
                  setCurrentRoom("room1");
                }
              }}
              style={{ backgroundColor: currentRoom === "room1" ? "lightgray" : "transparent" }}
            >
              Room 1
            </Button>
            <Button
              onClick={() => {
                if (currentRoom !== "room2") {
                  setMessages([]); // Clear messages for the old room
                  setCurrentRoom("room2");
                }
              }}
              style={{ backgroundColor: currentRoom === "room2" ? "lightgray" : "transparent" }}
            >
              Room 2
            </Button>
          </div>

          {/* Message container with scroll */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {messages.map((message) => (
              <div key={message.id}>
                <strong>{message.who}:</strong> {message.what}{" "}
                <span style={{ fontSize: "small", color: "gray" }}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and send button */}
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      ) : (
        <div>
          <div className="text-red-600">color</div>
          <Login onLogin={handleLogin} />
          <h2>Register</h2>
          <Register onRegister={handleRegister} />
        </div>
      )}
    </div>
  );
};

export default Test;
