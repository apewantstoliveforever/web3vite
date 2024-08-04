//page server

import ChatServer from "@/components/chat-server/chat-server";
const Server = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-2xl font-bold">Server</h1>
      <ChatServer selectedFriend={'e33333'} onBack={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
};

export default Server;
