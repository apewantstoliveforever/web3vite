import { useEffect, useRef } from "react";

const VideoStream: React.FC<{ stream: MediaStream }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);
  
    return <video ref={videoRef} autoPlay playsInline />;
  };