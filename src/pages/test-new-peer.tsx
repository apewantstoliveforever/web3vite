import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

const enableTrickle = true;

const TestNewPeer: React.FC = () => {
  const [peers, setPeers] = useState<{ [key: string]: Peer.Instance }>({});
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [signalInput, setSignalInput] = useState<string>('');
  const [peerIdInput, setPeerIdInput] = useState<string>('');
  const [mediaErr, setMediaErr] = useState<string | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getMedia = (callback: (stream: MediaStream) => void, err: (e: Error) => void) => {
      const options = { video: true, audio: true };
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(options)
          .then(stream => callback(stream))
          .catch(e => err(e));
      } else {
        navigator.getUserMedia(options, callback, err);
      }
    };

    const onMedia = (stream: MediaStream) => {
      setStream(stream);
      createPeer(); // Create an initial peer
    };

    getMedia(onMedia, (err) => {
      setMediaErr('Could not access webcam');
      console.error('getMedia error', err);
    });
  }, []);

  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
    attachPeerVideos();
  }, [stream]);

  const createPeer = (initiator = true, peerId?: string) => {
    const peer = new Peer({ initiator, trickle: enableTrickle, stream });

    peer.on('signal', (signal) => {
      if (peerId) {
        setSignalInput(JSON.stringify(signal));
      }
    });

    peer.on('stream', (stream) => {
      peer.stream = stream;
      setPeerState(peerId || 'default', peer);
    });

    peer.on('connect', () => {
      peer.connected = true;
      setPeerState(peerId || 'default', peer);
      peer.send(serialize({ msg: 'hey man!' }));
    });

    peer.on('data', data => {
      console.log('Data from peer', unserialize(data));
    });

    peer.on('error', (e) => {
      console.error('Peer error', e);
    });

    setPeerState(peerId || 'default', peer);

    return peer;
  };

  const setPeerState = (peerId: string, peer: Peer.Instance) => {
    setPeers(prevPeers => ({ ...prevPeers, [peerId]: peer }));
  };

  const serialize = (data: any) => JSON.stringify(data);

  const unserialize = (data: any) => {
    try {
      return JSON.parse(data.toString());
    } catch {
      return undefined;
    }
  };

  const attachPeerVideos = () => {
    Object.entries(peers).forEach(([peerId, peer]) => {
      if (peer.video && !peer.video.srcObject && peer.stream) {
        peer.video.setAttribute('data-peer-id', peerId);
        peer.video.srcObject = peer.stream;
      }
    });
  };

  const handleSignalInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSignalInput(e.target.value);
  };

  const handlePeerIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeerIdInput(e.target.value);
  };

  const handleSignalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (peerIdInput && signalInput) {
      const peer = createPeer(false, peerIdInput);
      peer.signal(JSON.parse(signalInput));
    }
  };

  const renderPeers = () => {
    return Object.entries(peers).map(([peerId, peer]) => (
      <div key={peerId}>
        <video ref={video => peer.video = video}></video>
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">WebRTC Video Chat</h1>
      </header>
      {mediaErr && (
        <p className="error">{mediaErr}</p>
      )}
      <div id="me">
        <video id="myVideo" ref={videoRef} controls></video>
      </div>
      <form onSubmit={handleSignalSubmit}>
        <input
          type="text"
          placeholder="Peer ID"
          value={peerIdInput}
          onChange={handlePeerIdInputChange}
        />
        <textarea
          placeholder="Signal data"
          value={signalInput}
          onChange={handleSignalInputChange}
        />
        <button type="submit">Connect to Peer</button>
      </form>
      <div id="peers">{renderPeers()}</div>
    </div>
  );
};

export default TestNewPeer;
