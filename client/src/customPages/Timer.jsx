import React, { useState, useEffect, useMemo } from "react";

const Timer = ({ progressId, onTimeUp, timeLeft, setTimeLeft }) => {
  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const WS_URL = useMemo(() => API_URL.replace(/^http/, "ws"), [API_URL]); // ✅ Memoized for performance

  useEffect(() => {
    if (!progressId) return;

    const socket = new WebSocket(`${WS_URL}/ws?progressId=${progressId}`); // ✅ Added "/ws" path

    socket.onopen = () => console.log("✅ Connected to WebSocket");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.timeLeft !== undefined) {
          setTimeLeft(data.timeLeft);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
    socket.onclose = () => console.log("🔴 WebSocket Disconnected");

    return () => socket.close(); // ✅ Cleanup WebSocket on unmount
  }, [progressId, WS_URL, setTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <h5 className="text-danger d-flex justify-content-end">
      Time Left ⏳: {formatTime(timeLeft ?? 0)}
    </h5>
  );
};

export default Timer;
