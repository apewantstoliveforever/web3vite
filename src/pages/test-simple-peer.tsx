import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const TestSimplePeer: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [peerId, setPeerId] = useState<string>("");
  const [receiverPeerId, setReceiverPeerId] = useState<string>("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Initialize PeerJS
    const peerInstance = new Peer(undefined, { debug: 3 });
    peerRef.current = peerInstance;

    peerInstance.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);
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

    peerInstance.on("call", (call) => {
      call.answer(localStream);
      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    });

    return () => {
      peerInstance.destroy();
    };
  }, [localStream]);

  const handleStartWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

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

      const call = peer.call(receiverPeerId, localStream!);
      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
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
      const conn = peer.connections[receiverPeerId]?.[0];
      if (conn && conn.open) {
        conn.send(message);
        setMessage("");
      } else {
        console.error("Connection is not open. Unable to send message.");
      }
    } else {
      console.error(
        "Peer connection is not established or receiverPeerId is missing."
      );
    }
  };

  return (
    <div>
      <div>PeerJS Video Chat Room</div>
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
      <button onClick={handleStartWebcam}>Start Webcam</button>
      <div>
        <h3>Received Messages:</h3>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Local Video</h3>
        <video ref={localVideoRef} autoPlay playsInline muted></video>
      </div>
      <div>
        <h3>Remote Video</h3>
        <video ref={remoteVideoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default TestSimplePeer;
