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

  const friends = ["Friend 1", "Friend 2", "Friend 3"];

  return (
    <div className={`flex h-screen ${isMobileView ? 'flex-col' : 'flex-row'}`}>
      <div className={`transition-transform ${showChatBox ? "hidden" : "block"} ${isMobileView ? "w-full" : "w-1/4"} bg-gray-200`}>
        <ChatList friends={friends} onSelectFriend={setSelectedFriend} />
      </div>

      {/* Chat box */}
      <div className={`transition-transform ${!isMobileView || showChatBox ? "block" : "hidden"} ${isMobileView ? "w-full" : "w-3/4"} bg-white`}>
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
