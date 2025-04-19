import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const server_url = 'http://localhost:3000';
let connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

function VideoCallPage() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef();
  const lobbyVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [screenAvailable, setScreenAvailable] = useState(false);

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);

  const [videos, setVideos] = useState([]);
  const [askForUsername, setAskForUsername] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(!!videoPermission);

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(!!audioPermission);

      try {
        const screenPermission = await navigator.mediaDevices.getDisplayMedia();
        setScreenAvailable(!!screenPermission);
      } catch {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        window.localStream = userMediaStream;

        if (lobbyVideoRef.current) {
          lobbyVideoRef.current.srcObject = userMediaStream;
        }
      }
    } catch (err) {
      console.log('Permission error:', err);
    }
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === 'offer') {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
              });
            });
          }
        });
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(console.log);
      }
    }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketIdRef.current = socketRef.current.id;
      socketRef.current.emit('accept-call', window.location.href);

      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          if (!connections[socketListId]) {
            connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

            connections[socketListId].onicecandidate = (event) => {
              if (event.candidate) {
                socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
              }
            };

            connections[socketListId].ontrack = (event) => {
              const videoExists = videos.some((v) => v.socketId === socketListId);

              if (!videoExists) {
                setVideos((prev) => [
                  ...prev,
                  {
                    socketId: socketListId,
                    stream: event.streams[0],
                  },
                ]);
              }
            };

            if (window.localStream) {
              window.localStream.getTracks().forEach((track) => {
                connections[socketListId].addTrack(track, window.localStream);
              });
            }
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', id2, JSON.stringify({ sdp: description }));
              });
            });
          }
        }
      });

      socketRef.current.on('disconnect-user', (id) => {
        setVideos((prev) => prev.filter((v) => v.socketId !== id));
      });
    });
  };

  const connect = () => {
    setAskForUsername(false);
    connectToSocketServer();
  };

  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = ctx.createMediaStreamDestination();
    oscillator.connect(dst);
    oscillator.start();
    const track = dst.stream.getAudioTracks()[0];
    track.enabled = false;
    return track;
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height });
    const stream = canvas.captureStream();
    const track = stream.getVideoTracks()[0];
    track.enabled = false;
    return track;
  };

  return (
    <div className="w-full h-screen pt-4 px-2 md:p-10">
      {askForUsername ? (
        <div>
          <h1>Enter into lobby 💕</h1>
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            className="!px-5 !py-2 rounded-md border-2 border-black"
            placeholder="Enter your name"
          />
          <button
            onClick={connect}
            className="!px-4 !py-2 bg-blue-700 cursor-pointer text-white rounded-xl ml-2"
          >
            Connect
          </button>

          <div className="w-screen h-[120vw] md:h-[30vw] mt-4">
            <video ref={lobbyVideoRef} autoPlay muted playsInline className="w-full h-full" />
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Local Video</h2>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-auto md:h-[50vh]" />

          <div className="mt-4">
            <h2 className="text-lg font-semibold flex gap-2">Remote Videos</h2>
            {videos.map((video) => (
              <div key={video.socketId} className='flex '>
                <video
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-auto md:h-[30vw] mb-4"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default VideoCallPage;
