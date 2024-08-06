import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Camera, Monitor } from "lucide-react";
import { useSelector } from "react-redux";
import { db } from "@/services/gun";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

interface VideoCallServerProps {
  selectedChannel: string | null;
  onBack: () => void;
  serverName: string;
}

const VideoStream: React.FC<{ stream: MediaStream; muted?: boolean }> = ({
  stream,
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline muted={muted} />;
};

const VideoCallServer: React.FC<VideoCallServerProps> = ({
  selectedChannel,
  onBack,
  serverName,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    { stream: MediaStream; peerId: string }[]
  >([]);
  const username = useSelector((state: any) => state.auth.username);
  const peerRef = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [allPeers, setAllPeers] = useState<any[]>([]);

  useEffect(() => {
    const peerInstance = new Peer(uuidv4(), { debug: 3 });
    peerRef.current = peerInstance;
    peerInstance.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);
    });

    peerInstance.on("call", (call) => {
      call.answer(localStream!);
      call.on("stream", (remoteStream) => {
        setRemoteStreams((prevStreams) => {
          const existingStreamIndex = prevStreams.findIndex(
            (stream) => stream.peerId === call.peer
          );
          if (existingStreamIndex !== -1) {
            const updatedStreams = [...prevStreams];
            updatedStreams[existingStreamIndex] = {
              stream: remoteStream,
              peerId: call.peer,
            };
            return updatedStreams;
          }
          return [...prevStreams, { stream: remoteStream, peerId: call.peer }];
        });
      });

      call.on("close", () => {
        setRemoteStreams((prevStreams) =>
          prevStreams.filter((stream) => stream.peerId !== call.peer)
        );
      });

      call.on("error", () => {
        setRemoteStreams((prevStreams) =>
          prevStreams.filter((stream) => stream.peerId !== call.peer)
        );
      });
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [selectedChannel, serverName, username, localStream]);

  useEffect(() => {
    if (!peerId) return;

    const videoCallRef = db
      .get(serverName)
      .get(`rooms/${selectedChannel}/video-call12`);

    videoCallRef.once((data: any) => {
      if (!data) {
        videoCallRef.put(JSON.stringify([{ peer_id: peerId, username }]));
        return;
      }
      const peers = JSON.parse(data);
      console.log("Peers:", peers);

      const index = peers.findIndex((peer: any) => peer.username === username);
      if (index === -1) {
        videoCallRef.put(
          JSON.stringify([...peers, { peer_id: peerId, username }])
        );
      } else {
        peers[index].peer_id = peerId;
        peers[index].username = username;
        videoCallRef.put(JSON.stringify(peers));
      }
    });

    videoCallRef.on((data: any) => {
      if (!data) return;
      setAllPeers(JSON.parse(data));
    });

    return () => {
      videoCallRef.off();
    };
  }, [peerId, selectedChannel, serverName, username]);

  useEffect(() => {
    if (!peerRef.current || !localStream) return;

    const peersCalled = new Set<string>();

    allPeers.forEach((peer) => {
      if (peer.peer_id === peerId || peersCalled.has(peer.peer_id)) return;

      peersCalled.add(peer.peer_id);

      const call = peerRef.current!.call(peer.peer_id, localStream);

      call.on("stream", (remoteStream) => {
        if (!remoteStream) {
          setRemoteStreams((prevStreams) =>
            prevStreams.filter((stream) => stream.peerId !== call.peer)
          );
          return;
        }
        setRemoteStreams((prevStreams) => {
          const existingStreamIndex = prevStreams.findIndex(
            (stream) => stream.peerId === call.peer
          );
          if (existingStreamIndex !== -1) {
            const updatedStreams = [...prevStreams];
            updatedStreams.splice(existingStreamIndex, 1, {
              stream: remoteStream,
              peerId: call.peer,
            });
            return updatedStreams;
          }
          return [...prevStreams, { stream: remoteStream, peerId: call.peer }];
        });
      });

      call.on("close", () => {
        console.log("Call closed by peer:", call.peer);
        setRemoteStreams((prevStreams) =>
          prevStreams.filter((stream) => stream.peerId !== call.peer)
        );
      });

      call.on("error", (error) => {
        console.error("Error calling peer:", call.peer, error);
        setRemoteStreams((prevStreams) =>
          prevStreams.filter((stream) => stream.peerId !== call.peer)
        );
      });
    });
  }, [allPeers, localStream]);

  useEffect(() => {
    const handleOnlineStatus = () => {
      if (!navigator.onLine) {
        console.log("Lost connection");
        handleStopSharing();
      }
    };

    window.addEventListener("offline", handleOnlineStatus);
    window.addEventListener("online", handleOnlineStatus);

    return () => {
      window.removeEventListener("offline", handleOnlineStatus);
      window.removeEventListener("online", handleOnlineStatus);
    };
  }, []);

  const handleShareCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      handleStream(stream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      handleStream(stream);
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const handleStream = (stream: MediaStream) => {
    setLocalStream(stream);
    stream.getTracks().forEach((track) => {
      track.addEventListener("ended", handleStopSharing);
    });
  };

  const handleStopSharing = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
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
        <h2 className="text-xl font-bold">{selectedChannel}</h2>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden relative">
        {localStream && (
          <div className="absolute bottom-4 right-4 w-1/4 h-1/4 border">
            <VideoStream stream={localStream} muted />
          </div>
        )}
        <div className="flex flex-wrap">
          {remoteStreams.map(({ stream, peerId }) =>
            stream ? (
              <div
                key={peerId}
                className="w-1/3 h-1/3 border border-gray-300 p-2"
              >
                <VideoStream stream={stream} />
                <div className="text-center mt-2">
                  {
                    allPeers.find((peer: any) => peer.peer_id === peerId)
                      ?.username
                  }
                </div>
              </div>
            ) : null
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Button
            onClick={handleShareCamera}
            variant="outline"
            className="text-blue-500 hover:bg-blue-100 flex items-center mr-2"
          >
            <Camera className="mr-2" />
            Share Camera
          </Button>
          {/* <Button
            onClick={handleShareScreen}
            variant="outline"
            className="text-blue-500 hover:bg-blue-100 flex items-center"
          >
            <Monitor className="mr-2" />
            Share Screen
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCallServer;
