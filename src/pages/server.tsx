//page server

import ChatServer from "@/components/chat-server/chat-server";
import VideoCallServer from "@/components/chat-server/video-call-server";
import { useState } from "react";
import { useParams } from "react-router-dom";
const Server = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(
    window.innerWidth < 768
  );
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(
    "channel messages"
  );

  //get :id from url
  const { id } = useParams<{ id: string }>();

  const channelList = ["channel-messages", "video-call-channel"];
  return (
    <div
      className={`flex h-screen ${
        isMobileView ? "flex-col" : "flex-row"
      } w-full`}
    >
      <div
        className={`${isMobileView && showChatBox ? "hidden" : ""} ${
          isMobileView
            ? "w-full top-0 left-0 h-full z-10 bg-gray-200"
            : "w-1/4 bg-gray-200"
        }`}
      >
        {channelList.map((channel) => (
          <div
            key={channel}
            className="p-2 hover:bg-gray-300 cursor-pointer"
            onClick={() => {
              setSelectedChannel(channel);
              if (isMobileView) {
                setShowChatBox(true);
              }
            }}
          >
            {channel}
          </div>
        ))}
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
                // setSelectedChannel(null);
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
                // setSelectedChannel(null);
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
