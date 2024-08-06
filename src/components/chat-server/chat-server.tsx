import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { db } from "@/services/gun";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";

interface Message {
  who: string;
  what: string | null;
  timestamp: number;
  image: string | null; // Base64 image
  type?: string; // Optional type field for notification messages
  signal?: string;
  id?: string;
}

interface ChatServerProps {
  selectedChannel: string | null;
  onBack: () => void;
  serverName: string;
}

const ChatServer: React.FC<ChatServerProps> = ({
  selectedChannel,
  onBack,
  serverName,
}) => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const username = useSelector((state: any) => state.auth.username);
  const [image, setImage] = useState<File | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState<boolean>(false);
  const [signal, setSignal] = useState<string>("");
  const [otherUserAvatar, setOtherUserAvatar] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedChannel || !serverName) return;

    setMessages([]);
    setAcceptDialogOpen(false);
    setSignal("");

    // Subscribe to user data and fetch profile avatar
    const userSubscription = db
      .get(`~@${selectedChannel}`)
      .on(async (userData: any) => {
        const keys = Object.keys(userData["_"][">"]);
        const key = keys[0].slice(1);
        db.get(key)
          .get("profile")
          .get("avatar")
          .on((data: any) => {
            setOtherUserAvatar(data);
          });
      });

    // Unsubscribe from previous messages
    if (messagesRef.current) {
      messagesRef.current.map().off();
    }

    messagesRef.current = db
      .get(serverName)
      .get(`rooms/${selectedChannel}/messages1`);
    const messagesSubscription = messagesRef.current
      .map()
      .on((message: any) => {
        if (message) {
          setMessages((prev) => {
            const newMessages = prev.filter((msg) => msg.id !== message.id);
            if (message.type === "notification" && message.who !== username) {
              if (Date.now() - message.timestamp < 3000) {
                setAcceptDialogOpen(true);
                setSignal(message.signal || "");
              }
            } else if (
              message.type === "notification-accept" &&
              message.who !== username
            ) {
              if (Date.now() - message.timestamp < 3000) {
                setSignal(message.signal || "");
              }
            }
            newMessages.push(message);
            return newMessages;
          });
        }
      });

    return () => {
      userSubscription.off();
      messagesSubscription.off();
    };
  }, [selectedChannel, serverName, username]);

  useEffect(() => {
    // Scroll to the bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
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

  const handleSendMessage = async () => {
    if (!username || !selectedChannel) return;

    const message: Message = {
      who: username,
      what: text,
      timestamp: Date.now(),
      image: null, // Initialize image field as null
      id: uuidv4(),
    };

    if (image) {
      try {
        const compressedImage = await compressImage(image);
        const base64Image = await convertToBase64(compressedImage);
        message.image = base64Image;
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    db.get(serverName).get(`rooms/${selectedChannel}/messages1`).set(message);

    setText(""); // Clear the input after sending
    setImage(null); // Clear the selected image
  };

  const handleSendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default newline behavior
      handleSendMessage();
    }
  };

  return (
    <Card className="flex-1 bg-white shadow-md rounded-lg w-full h-full flex flex-col">
      <CardHeader className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4 flex-row">
        <Button
          onClick={onBack}
          variant="outline"
          className="text-blue-500 hover:bg-blue-100 flex items-center"
        >
          <ArrowLeft className="mr-2" />
        </Button>
        <h2 className="text-xl font-bold">{selectedChannel}</h2>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden relative w-full p-0">
        {localStream && (
          <div className="absolute bottom-4 w-full h-full">
            {/* <VideoStream stream={localStream} onStop={handleStopSharing} /> */}
          </div>
        )}
        <div className="flex-1 overflow-y-auto space-y-4 h-[300px] w-full">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start">
              <Card className="flex flex-col items-start p-2">
                <CardHeader className="flex flex-col items-start space-x-2">
                  <CardTitle className="text-sm font-semibold text-left">
                    {msg.who}
                  </CardTitle>
                  <CardDescription className="text-left md:text-xs">
                    {formatTimestamp(msg.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-left text-sm">
                  {msg.what}
                </CardContent>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="w-full h-auto max-w-xs max-h-64 mt-2 rounded-lg object-contain"
                  />
                )}
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Add ref for scrolling */}
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg p-2 mr-2"
              onKeyDown={handleKeyDown}
            />
            <Button className="relative">
              Send Picture
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleSendImage}
              />
            </Button>

            <Button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatServer
