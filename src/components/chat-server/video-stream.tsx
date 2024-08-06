import React, { useEffect, useRef } from "react";

interface VideoStreamProps {
  stream: MediaStream;
  onStop: () => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ stream, onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      //check if the stream is available
      if (stream) videoRef.current.srcObject = stream;
      else {
        onStop();
      }
    }
    else {
    }
  }, [stream]);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay className="rounded-lg w-full h-full" />
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