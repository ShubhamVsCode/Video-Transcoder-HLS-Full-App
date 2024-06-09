"use client";

import VideoJS from "@/components/core/videojs";
import React, { useRef } from "react";

const VideoPage = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    plugins: {
      qualityLevels: {
        default: "auto",
      },
    },
    sources: [
      {
        src: "https://s3.ap-south-1.amazonaws.com/hls-prod.shubhamvscode/output_360p/hls_360p.m3u8",
        type: "application/x-mpegURL",
      },
      {
        src: "https://s3.ap-south-1.amazonaws.com/hls-prod.shubhamvscode/output_480p/hls_480p.m3u8",
        type: "application/x-mpegURL",
      },
      {
        src: "https://s3.ap-south-1.amazonaws.com/hls-prod.shubhamvscode/output_720p/hls_720p.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
};

export default VideoPage;
