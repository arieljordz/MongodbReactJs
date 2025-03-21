import React, { useState, useEffect } from "react";

const Timer = ({ progressId, onTimeUp, timeLeft, setTimeLeft }) => {

  useEffect(() => {
    if (!progressId) return;

    const socket = new WebSocket(`ws://localhost:8080?progressId=${progressId}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.timeLeft !== undefined) {
        setTimeLeft(data.timeLeft); // ✅ Get latest timeLeft from server
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, [progressId]);

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
      Time Left ⏳: {formatTime(timeLeft)}
    </h5>
  );
};

export default Timer;
