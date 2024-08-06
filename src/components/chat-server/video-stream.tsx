import React, { useEffect, useRef } from "react";

interface VideoStreamProps {
  stream: MediaStream;
  onStop: () => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ stream, onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Check if the stream is available
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Ensure the video is muted
      } else {
        onStop();
      }
    }
  }, [stream, onStop]);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay className="rounded-lg w-full h-full" muted />
      <button
        onClick={onStop}
        className="absolute top-2 right-2 bg-red-500 text-white rounded p-1"
      >
        Stop
      </button>
    </div>
  );
};

export default VideoStream;
