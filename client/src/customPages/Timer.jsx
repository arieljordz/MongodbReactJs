import React, { useState, useEffect } from "react";

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // Call the callback function when time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft, onTimeUp]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return <h6 className="text-danger d-flex justify-content-end">Time Left: {formatTime(timeLeft)}</h6>;
};

export default Timer;
