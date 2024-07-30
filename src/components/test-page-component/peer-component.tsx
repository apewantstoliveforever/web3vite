import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";

interface PeerComponentProps {
  senderId: string;
}

const PeerComponent: React.FC<PeerComponentProps> = ({ senderId }) => {
  const randomId = uuidv4();
  let peer: Peer;

  useEffect(() => {
    peer = new Peer(randomId);

    peer.on("open", (id) => {
      console.log("Peer ID:", id);
    });

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log("Received data:", data);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const handleConnect = () => {
    console.log("Connecting to peer...", senderId, randomId);
    const conn = peer.connect(senderId);
    conn.on("open", () => {
      console.log("Connection established with peer:", senderId);
      conn.send("Hello from PeerComponent!");
    });
  };

  return (
    <div>
      Peer ID: {randomId}
      <Button onClick={handleConnect}>Connect to Peer</Button>
    </div>
  );
};

export default PeerComponent;
