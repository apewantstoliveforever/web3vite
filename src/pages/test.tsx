import React, { useState, useEffect, useRef } from "react";
import { db, user, sea } from "@/services/gun";
import Login from "@/components/test-page-component/login-component";
import Register from "@/components/test-page-component/register-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import imageCompression from "browser-image-compression";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PeerComponent from "@/components/test-page-component/peer-component";

// import { Peer } from "peerjs";
import Peer from "peerjs";

interface Message {
  who: string;
  what: string | null;
  timestamp: number;
  image: string | null; // Optional image field in base64
  type: string | null; // Optional type field for notification messages
  signal?: string;
}

const Test: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const [logined, setLogined] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [currentRoom, setCurrentRoom] = useState<string>("room3");
  const [image, setImage] = useState<File | null>(null); // For handling image uploads
  const [avatar, setAvatar] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [peerId, setPeerId] = useState<string>("");

  const [acceptDialogOpen, setAcceptDialogOpen] = useState<boolean>(false);
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<any>(null);

  const [signal, setSignal] = useState<string>("");
  const [signalReceive, setSignalReceive] = useState<string>("");

  const [enterVideoCall, setEnterVideoCall] = useState<boolean>(false);

  const handleLogin = () => {
    setLogined(true);
    user.get("alias").then((alias: string) => setUsername(alias));
  };

  const handleRegister = () => {
    setLogined(true);
    user.get("alias").then((alias: string) => setUsername(alias));
  };

  const onSelectedUsernameChange = (username: string) => {
    setSelectedUsername(username);
    //open dialog
    setDialogOpen(true);
  };

  const sendNotification = async () => {
    setSignal("");
    setEnterVideoCall(true);
  };

  useEffect(() => {
    // Check local storage
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      console.log("Logging in with stored credentials...", storedUsername);
      user.auth(storedUsername, storedPassword, () => {
        console.log("Logged in with stored credentials");
      });
    }

    const aliasRef = user.get("alias");
    aliasRef.on((alias: string) => {
      setUsername(alias);
    });

    //get user avatar
    const profileRef = user.get("profile");
    profileRef
      .get("avatar")
      .then((avatar: string) =>
        setAvatar(avatar || "https://github.com/shadcn.png")
      );

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
    messagesRef.current = db.get(`rooms/${currentRoom}/messages1`);
    messagesRef.current.map().on((message: any, id: any) => {
      if (message) {
        setMessages((prevMessages) => {
          const newMessages = prevMessages.filter((msg) => msg.id !== id);
          newMessages.push({ id, ...message });
          // if its a new coming notification from other user open dialog
          // Check if the message is a new notification
          if (message.type === "notification" && message.who !== username) {
            console.log("Notification received from", message.who);

            // Compare timestamp to ensure the notification is recent
            if (Date.now() - message.timestamp < 3000) {
              setAcceptDialogOpen(true);
              setSignal(message.signal || "");
            }
          } else if (
            message.type === "notification-accept"
            && message.who !== username
          ) {
            console.log("Notification signal", message.signal);
            console.log("Peer", peerId);

            // Compare timestamp to ensure the notification is recent
            if (Date.now() - message.timestamp < 3000) {
              setSignal(message.signal || "");
            }
          }
          return newMessages;
        });
      }
      //count number of messages
    });

    return () => {
      if (messagesRef.current) {
        db.get(`rooms/${currentRoom}/messages1`).off();
      }
    };
  }, [currentRoom]);

  const ClearAllChat = async () => {
    if (messagesRef.current) {
      const messages = await messagesRef.current.map().once();
      console.log("messages", messages);
      messagesRef.current.map().once((data, key) => {
        messagesRef.current.get(key).put(null);
      });

      // Object.keys(messages).forEach((id) => {
      //   // messagesRef.current.get(id).put(null);
      //   //clear in localstorage
      //   localStorage.removeItem(id);
      // });
      setMessages([]); // Clear messages state immediately
      console.log("All chat messages cleared.");
    }
    // db.get(`rooms/${currentRoom}/messages1`).set([]);
    // //remove all keys in the room
    // db.get(`rooms/${currentRoom}/messages1`).map().once((data, key) => {    });
    // setMessages([]);
    // console.log("All chat messages cleared.");
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
        type: null, // Initialize type field as null
      };

      if (image) {
        compressImage(image).then((compressedImage) => {
          convertToBase64(compressedImage).then((base64Image) => {
            message.image = base64Image;

            db.get(`rooms/${currentRoom}/messages1`).set(message);
            setText("");
            setImage(null); // Clear the selected image
          });
        });
      } else {
        db.get(`rooms/${currentRoom}/messages1`).set(message);
        setText(""); // Clear the input after sending
      }
    } else {
      console.error("Username is not set");
    }
  };

  const compressImage = async (image: File) => {
    const options = {
      maxSizeMB: 0.3,
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

          {/* Room selection */}
          <div>
            <Button
              onClick={() => {
                if (currentRoom !== "room3") {
                  setMessages([]);
                  setCurrentRoom("room3");
                }
              }}
              style={{
                backgroundColor:
                  currentRoom === "room3" ? "lightgray" : "transparent",
              }}
            >
              Room 3
            </Button>
            <Button
              onClick={() => {
                if (currentRoom !== "room4") {
                  setMessages([]);
                  setCurrentRoom("room4");
                }
              }}
              style={{
                backgroundColor:
                  currentRoom === "room4" ? "lightgray" : "transparent",
              }}
            >
              Room 4
            </Button>
          </div>

          {/* Message container with scroll */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {messages.map((message) => (
              <div key={message.id}>
                <Avatar
                  onClick={() => {
                    if (message.who !== username) {
                      onSelectedUsernameChange(message.who);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <strong>{message.who}:</strong> {message.what}{" "}
                {
                  message.type === "notification" ? (
                    <span style={{ color: "red" }}>Notification</span>
                  ) : null // Render a red "Notification" label for notification messages
                }
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
          <Button onClick={sendNotification}>Send Notification</Button>
        </div>
      ) : (
        <div>
          <div className="text-red-600">color</div>
          <Login onLogin={handleLogin} />
          <h2>Register</h2>
          <Register onRegister={handleRegister} />
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              {selectedUsername} is a user in this chat room.
              <Button onClick={sendNotification}>Send Notification</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <PeerComponent
                senderId={peerId}
                senderName={username}
                signalReceive={signal}
                currentRoom={currentRoom}
                setPeerId={setPeerId}
                peerId={peerId}
                enterVideoCall={enterVideoCall}
                username={username}
              />
              {/* <Button onClick={sendNotification}>Send Notification</Button> */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={enterVideoCall} onOpenChange={setEnterVideoCall}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <PeerComponent
                senderId={peerId}
                senderName={username}
                signalReceive={signal}
                currentRoom={currentRoom}
                setPeerId={setPeerId}
                peerId={peerId}
                enterVideoCall={enterVideoCall}
                username={username}
              />
              {/* <Button onClick={sendNotification}>Send Notification</Button> */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Test;
