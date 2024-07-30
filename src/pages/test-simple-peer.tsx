import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import Gun from "gun";

// Initialize GunDB
const gun = Gun();

const TestSimplePeer: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [peerId, setPeerId] = useState<string>("");
  const [receiverPeerId, setReceiverPeerId] = useState<string>("");

  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    // Initialize PeerJS
    const peerInstance = new Peer(undefined, { debug: 3 });
    peerRef.current = peerInstance;

    peerInstance.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);
      gun.get("users-right").get(id).put({ id }); // Store user ID in GunDB
    });

    peerInstance.on("connection", (conn) => {
      conn.on("data", (data: any) => {
        console.log("Data received:", data);
        setReceivedMessages((prevMessages) => [
          ...prevMessages,
          data.toString(),
        ]);
      });
    });

    // Fetch other peers from GunDB
    gun.get("users-right").on((data, key) => {
      //   if (key !== peerId) {
      //     console.log("Peer available:", data.id);
      //   }
      //get all id from gun
      console.log("Peer available:", data.id);
    });

    return () => {
      peerInstance.destroy();
      gun.get("users-right").get(peerId).put(null); // Remove user ID from GunDB
    };
  }, []);

  const handleConnect = () => {
    const peer = peerRef.current;
    if (peer && receiverPeerId) {
      const conn = peer.connect(receiverPeerId);
      conn.on("open", () => {
        console.log("Connected to", receiverPeerId);
        conn.send("Connected: " + Math.random());
      });

      conn.on("data", (data: any) => {
        console.log("Data received:", data);
        setReceivedMessages((prevMessages) => [
          ...prevMessages,
          data.toString(),
        ]);
      });
    } else {
      console.error(
        "Peer connection is not established or receiverPeerId is missing."
      );
    }
  };

  const handleSend = () => {
    const peer = peerRef.current;
    if (peer && receiverPeerId) {
      const connections = peer.connect[receiverPeerId];
      if (connections && connections.length > 0) {
        const conn = connections[0];
        if (conn.open) {
          conn.send(message);
          setMessage("");
        } else {
          console.error("Connection is not open. Unable to send message.");
        }
      } else {
        console.error("No connection found to the specified receiverPeerId.");
      }
    } else {
      console.error(
        "Peer connection is not established or receiverPeerId is missing."
      );
    }
  };

  return (
    <div>
      <div>PeerJS Chat Room</div>
      <p>Your Peer ID: {peerId}</p>
      <div>
        Receiver Peer ID:
        <input
          type="text"
          value={receiverPeerId}
          onChange={(e) => setReceiverPeerId(e.target.value)}
        />
      </div>
      <button onClick={handleConnect}>Connect</button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <h3>Received Messages:</h3>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestSimplePeer;
