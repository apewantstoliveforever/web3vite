import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { ArrowLeft, Camera, Monitor } from "lucide-react";
import VideoStream from "./video-stream";

import { useSelector } from "react-redux";
import { db, user } from "@/services/gun";
import imageCompression from "browser-image-compression";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Message {
  id: string;
  who: string;
  what: string | null;
  timestamp: number;
  image: string | null; // Optional image field in base64
  type: string | null; // Optional type field for notification messages
  signal?: string;
}

interface ChatBoxProps {
  selectedFriend: string | null;
  onBack: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ selectedFriend, onBack }) => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const username = useSelector((state: any) => state.auth.username);
  const [image, setImage] = useState<File | null>(null); // For handling image uploads

  const [acceptDialogOpen, setAcceptDialogOpen] = useState<boolean>(false);
  const [signal, setSignal] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<any>(null);

  const [otherUserAvatar, setOtherUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const room = sortAndCombineStrings([username, selectedFriend]);
    console.log("Room:", room);
    setCurrentRoom(room);
    setMessages([]);
    setAcceptDialogOpen(false);
    setSignal("");

    db.get(`~@${selectedFriend}`).on(async (userData: any) => {
      const keys = Object.keys(userData["_"][">"]);
      const key = keys[0].slice(1);
      console.log("Key:", key);
      db.get(key).get("profile").get("avatar").on((data: any) => {
        setOtherUserAvatar(data);
      });
    });

    if (messagesRef.current) {
      console.log("Unsubscribing from messages in room", currentRoom);
      messagesRef.current.map().off();
    }
    messagesRef.current = db.get(`rooms/${room}/messages`);
    messagesRef.current.map().on((message: any, id: any) => {
      if (message) {
        setMessages((prevMessages) => {
          // console.log("Previous messages:", message);
          const newMessages = prevMessages.filter((msg) => msg.id !== id);
          prevMessages.push({ id, ...message });
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
            message.type === "notification-accept" &&
            message.who !== username
          ) {
            console.log("Notification signal", message.signal);
            // console.log("Peer", peerId);

            // Compare timestamp to ensure the notification is recent
            if (Date.now() - message.timestamp < 3000) {
              setSignal(message.signal || "");
            }
          }
          return newMessages;
        });
      }
    });
  }, [selectedFriend]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };


  const compareAndCombine = (a: string, b: string): number => {
    const regex = /(\d+)|(\D+)/g;
    const aParts = a.match(regex);
    const bParts = b.match(regex);

    if (!aParts || !bParts) {
      return 0;
    }

    let result = 0;

    while (aParts.length && bParts.length) {
      const aPart = aParts.shift();
      const bPart = bParts.shift();

      if (aPart && bPart) {
        const aIsNum = !isNaN(Number(aPart));
        const bIsNum = !isNaN(Number(bPart));

        if (aIsNum && bIsNum) {
          const diff = Number(aPart) - Number(bPart);
          if (diff !== 0) {
            result = diff;
            break;
          }
        } else if (aIsNum || bIsNum) {
          result = aIsNum ? -1 : 1;
          break;
        } else {
          const diff = aPart.localeCompare(bPart, undefined, {
            sensitivity: "base",
          });
          if (diff !== 0) {
            result = diff;
            break;
          }
        }
      }
    }

    if (result === 0) {
      result = aParts.length - bParts.length;
    }

    return result;
  };

  // Hàm sắp xếp và kết hợp chuỗi thành dạng {stringtruoc}-{stringsau}
  const sortAndCombineStrings = (strings: string[]): string => {
    strings.sort(compareAndCombine);
    const combinedStrings: string[] = [];

    for (let i = 0; i < strings.length - 1; i++) {
      combinedStrings.push(`${strings[i]}-${strings[i + 1]}`);
    }
    return combinedStrings.join("-");
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
  const handleSendMessage = () => {
    console.log("Send message to room:", currentRoom);
    if (username) {
      const message: Message = {
        who: username,
        what: text,
        timestamp: Date.now(),
        image: null, // Initialize image field as null
        type: null,
        id: `${Date.now()}-${username}`,
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

  const handleShareCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      handleStream(stream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      handleStream(stream);
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const handleStream = (stream: MediaStream) => {
    setLocalStream(stream);
    stream.getTracks().forEach((track) => {
      track.addEventListener("ended", () => {
        handleStopSharing();
      });
    });
    // Here you would send the stream to the peer
    console.log("Stream:", stream);
  };

  const handleStopSharing = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
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
        <h2 className="text-xl font-bold">Chat with {selectedFriend}</h2>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden relative">
        {localStream && (
          <div className="absolute bottom-4 right-4 w-100 h-100">
            <VideoStream stream={localStream} onStop={handleStopSharing} />
          </div>
        )}
        {/* Hiển thị tin nhắn */}
        <div className="flex-1 overflow-y-auto space-y-4 h-[300px]">
          {messages.map((message) => (
            <div key={message.id}>
              <Avatar
                style={{ cursor: "pointer" }}
              >
                <AvatarImage src={message.who === username ? user.avatar : otherUserAvatar} />
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
        </div>
        {/* Ô nhập tin nhắn và nút gửi */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center mb-4">
            <Button
              onClick={handleShareCamera}
              className="bg-green-500 text-white hover:bg-green-600 mr-2"
              disabled={!!localStream}
            >
              <Camera className="mr-2" /> Share Camera
            </Button>
            <Button
              onClick={handleShareScreen}
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={!!localStream}
            >
              <Monitor className="mr-2" /> Share Screen
            </Button>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg p-2 mr-2"
            />
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

ChatBox.propTypes = {
  selectedFriend: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};

export default ChatBox;
