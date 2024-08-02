//page Chat

// import { Card } from "@/components/ui/card";
import React from "react";

import { Avatar, List } from "antd";
import { ChatLayout } from "@/components/chat/chat-layout";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const Chat: React.FC = () => {
  return (
    <div>
      <ChatLayout defaultLayout={undefined} navCollapsedSize={8} />
    </div>
  );
};

export default Chat;
