// src/components/MockupReel.js
import React, { useRef, useState } from 'react';
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const MockupReel = ({ videoSrc, device, color, landscape = false, zoom = 1 }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  console.log('videoSrc', videoSrc);
  console.log('device', device);
  console.log('color', color);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  return (
    <div className="mockup-reel">
      <DeviceFrameset device={device} color={color} landscape={landscape} zoom={zoom} width={410}>
        <div className="reel-video-wrapper">
          <video
            ref={videoRef}
            src={videoSrc}
            muted={muted}
            playsInline
            loop
            poster={videoSrc.replace('.mp4', '.webp')}
            preload="none"
            style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#111' }}
          />
          <div className="reel-controls">
            <button className='pausa' onClick={togglePlay}>
              {playing ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={toggleMute}>
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
        </div>
      </DeviceFrameset>
    </div>
  );
};

export default MockupReel;
