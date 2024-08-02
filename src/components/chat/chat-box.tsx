import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface ChatBoxProps {
  selectedFriend: string | null;
  onBack: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ selectedFriend, onBack }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage("");
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
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Hiển thị tin nhắn */}
        <div className="flex-1 overflow-y-auto space-y-4 h-[300px]">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
              {msg}
            </div>
          ))}
        </div>
        {/* Ô nhập tin nhắn và nút gửi */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
