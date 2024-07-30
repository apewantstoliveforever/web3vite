import React, { useState, useEffect, useRef } from "react";
import { db, user } from "@/services/gun";
import Login from "@/components/test-page-component/login-component";
import Register from "@/components/test-page-component/register-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import imageCompression from "browser-image-compression";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  who: string;
  what: string;
  timestamp: number;
  image?: string; // Optional image field in base64
}

const Test: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const [logined, setLogined] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>("room1");
  const [image, setImage] = useState<File | null>(null); // For handling image uploads
  const [avatar, setAvatar] = useState<string | null>(null); // For handling avatar uploads

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<any>(null);

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

    //get user avatar
    const profileRef = user.get("profile");
    profileRef.get("avatar").then((avatar: string) => setAvatar(avatar || "https://github.com/shadcn.png"));

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
      messagesRef.current.map().off();
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

    return () => {
      if (messagesRef.current) {
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
      const message: Message = {
        who: username,
        what: text,
        timestamp: Date.now(),
        image: null, // Initialize image field as null
      };

      if (image) {
        compressImage(image).then((compressedImage) => {
          convertToBase64(compressedImage).then((base64Image) => {
            message.image = base64Image;

            db.get(`rooms/${currentRoom}/messages`).set(message);
            setText("");
            setImage(null); // Clear the selected image
          });
        });
      } else {
        db.get(`rooms/${currentRoom}/messages`).set(message);
        setText(""); // Clear the input after sending
      }
    } else {
      console.error("Username is not set");
    }
  };

  const compressImage = async (image: File) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      return await imageCompression(image, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return image; // Return the original image in case of error
    }
  };

  const convertToBase64 = (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(image);
    });
  };

  const handleAvatarUpload = () => {
    if (avatar) {
      convertToBase64(avatar).then((base64Avatar) => {
        // Update user's profile with the new avatar URL
        user.get("profile").put({ avatar: base64Avatar });
        setAvatar(null); // Clear the selected avatar
      });
    } else {
      console.error("Avatar is not set");
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div>
      {logined ? (
        <div>
          <div>
            <h2>Welcome {username}</h2>
            <Avatar>
              <AvatarImage src={avatar || "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
          <Button onClick={ClearAllChat}>Clear All Chat</Button>

          {/* Avatar upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setAvatar(e.target.files[0])}
            />
            <Button onClick={handleAvatarUpload}>Upload Avatar</Button>
          </div>

          {/* Display Avatar */}
          <Avatar>
            <AvatarImage src={avatar || "https://github.com/shadcn.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Room selection */}
          <div>
            <Button
              onClick={() => {
                if (currentRoom !== "room1") {
                  setMessages([]);
                  setCurrentRoom("room1");
                }
              }}
              style={{
                backgroundColor:
                  currentRoom === "room1" ? "lightgray" : "transparent",
              }}
            >
              Room 1
            </Button>
            <Button
              onClick={() => {
                if (currentRoom !== "room2") {
                  setMessages([]);
                  setCurrentRoom("room2");
                }
              }}
              style={{
                backgroundColor:
                  currentRoom === "room2" ? "lightgray" : "transparent",
              }}
            >
              Room 2
            </Button>
          </div>

          {/* Message container with scroll */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {messages.map((message) => (
              <div key={message.id}>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <strong>{message.who}:</strong> {message.what}{" "}
                {message.image && (
                  <img
                    src={message.image}
                    alt="sent"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                  />
                )}
                <span style={{ fontSize: "small", color: "gray" }}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and send button */}
          <Input value={text} onChange={(e) => setText(e.target.value)} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
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