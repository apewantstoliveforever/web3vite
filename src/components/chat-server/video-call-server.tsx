import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { ArrowLeft, Camera, Monitor } from "lucide-react";
// import VideoStream from "./video-stream";

import { useSelector } from "react-redux";
import { db, user } from "@/services/gun";
import imageCompression from "browser-image-compression";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { v4 as uuidv4 } from 'uuid';
import VideoStream from "../chat/video-stream";

interface Message {
  // id: string;
  who: string;
  what: string | null;
  timestamp: number;
  image: string | null; // Optional image field in base64
  type: string | null; // Optional type field for notification messages
  signal?: string;
  id?: string;
}

interface VideoCallServerProps {
  selectedChannel: string | null;
  onBack: () => void;
  serverName: string;
}

const VideoCallServer: React.FC<VideoCallServerProps> = ({
  selectedChannel,
  onBack,
  serverName,
}) => {
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
    setMessages([]);
    setAcceptDialogOpen(false);
    setSignal("");

    // Unsubscribe from previous messages
    if (messagesRef.current) {
      console.log("Unsubscribing from messages in room", currentRoom);
      messagesRef.current.map().off();
    }

    console.log("Selected channel:", selectedChannel);
    messagesRef.current = db
      .get(serverName)
      .get(`rooms/${selectedChannel}/messages1`);
    const messagesSubscription = messagesRef.current
      .map()
      .on((message: any) => {
      });

    // Cleanup function to unsubscribe from user data and messages
    return () => {
      // userSubscription.off();
      messagesSubscription.off();
    };
  }, [selectedChannel, currentRoom, serverName, username]);

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
        Video call
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
      <CardContent className="flex-1 flex flex-col overflow-hidden relative">
        {localStream && (
          <div className="absolute bottom-4 right-4 w-100 h-100">
            <VideoStream stream={localStream} onStop={handleStopSharing} />
          </div>
        )}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCallServer;
