import React, { useState, useEffect } from "react";
import ChatList from "@/components/chat/chat-list";
import ChatBox from "@/components/chat/chat-box";

const Chat: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);

  const handleResize = () => {
    setIsMobileView(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobileView && selectedFriend !== null) {
      setShowChatBox(true);
    } else if (!isMobileView) {
      setShowChatBox(false);
    }
  }, [isMobileView, selectedFriend]);

  const friends = ["watthefman", "1234567890aaa4", "Friend 3"];

  return (
    <div className={`flex h-screen ${isMobileView ? "flex-col" : "flex-row"} w-full`}>
      <div
        className={`${
          isMobileView && showChatBox ? "hidden" : ""
        } ${isMobileView ? "w-full top-0 left-0 h-full z-10 bg-gray-200" : "w-1/4 bg-gray-200"}`}
      >
        <ChatList friends={friends} onSelectFriend={setSelectedFriend} />
      </div>

      <div
        className={`transition-transform ${
          isMobileView ? (showChatBox ? "translate-x-0" : "translate-x-full") : ""
        } ${isMobileView ? "w-full fixed top-0 left-0 h-full z-20 bg-white" : "w-3/4 bg-white"}`}
      >
        {selectedFriend === null ? (
          <div className="text-center text-gray-500">Select a friend to start chatting</div>
        ) : (
          <ChatBox
            selectedFriend={selectedFriend}
            onBack={() => {
              setSelectedFriend(null);
              if (isMobileView) {
                setShowChatBox(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
