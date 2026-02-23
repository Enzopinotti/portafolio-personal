import React, { useRef, useState } from 'react';
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const DeviceReels = ({ device, color, landscape = false, zoom, videos, className }) => {
  // Convertimos el nombre del dispositivo en una clase: "iPhone X" => "device-iphone-x"
  const deviceClass = device.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`device-reels ${deviceClass} ${className || ''}`}>
      <DeviceFrameset device={device} color={color} landscape={landscape} zoom={zoom}>
        <div className="device-screen">
          <Swiper slidesPerView={1} spaceBetween={5} grabCursor={true}>
            {videos.map((videoSrc, index) => (
              <SwiperSlide key={index}>
                <VideoSlide videoSrc={videoSrc} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </DeviceFrameset>
    </div>
  );
};

const VideoSlide = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

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
    <div className="video-slide">
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
      <div className="video-controls">
        <button className="play-pause" onClick={togglePlay}>
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={toggleMute}>
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
    </div>
  );
};

export default DeviceReels;
