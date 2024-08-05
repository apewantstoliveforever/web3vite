import ChatServer from "@/components/chat-server/chat-server";
import VideoCallServer from "@/components/chat-server/video-call-server";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Server = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(
    window.innerWidth < 768
  );
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>("channel-messages");

  // Get :id from URL
  const { id } = useParams<{ id: string }>();

  const channelList = ["channel-messages", "video-call-channel"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`flex h-screen ${isMobileView ? "flex-col" : "flex-row"} w-full`}>
      <div
        className={`${isMobileView && showChatBox ? "hidden" : ""} ${
          isMobileView
            ? "w-full top-0 left-0 h-full z-10 bg-gray-200"
            : "w-1/4 bg-gray-200"
        }`}
      >
        <ul className="list-none p-0 m-0">
          {channelList.map((channel) => (
            <li
              key={channel}
              className={`p-3 cursor-pointer rounded-md transition-colors duration-300 ${
                selectedChannel === channel
                  ? "bg-blue-500 text-white font-semibold"
                  : "hover:bg-gray-300 text-gray-700"
              }`}
              onClick={() => {
                setSelectedChannel(channel);
                if (isMobileView) {
                  setShowChatBox(true);
                }
              }}
            >
              {channel}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`transition-transform ${
          isMobileView
            ? showChatBox
              ? "translate-x-0"
              : "translate-x-full"
            : ""
        } ${
          isMobileView
            ? "w-full fixed top-0 left-0 h-full z-20 bg-white"
            : "w-3/4 bg-white"
        }`}
      >
        {id &&
          (selectedChannel === "channel-messages" ? (
            <ChatServer
              selectedChannel={selectedChannel}
              serverName={id}
              onBack={() => {
                if (isMobileView) {
                  setShowChatBox(false);
                }
              }}
            />
          ) : (
            <VideoCallServer
              selectedChannel={selectedChannel}
              serverName={id}
              onBack={() => {
                if (isMobileView) {
                  setShowChatBox(false);
                }
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Server;
