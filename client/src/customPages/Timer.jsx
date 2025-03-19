import React, { useState, useEffect } from "react";

const Timer = ({ duration, onTimeUp, updateTimeLeft }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // ✅ Reset timer when duration changes
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp(); // ✅ Calls parent callback, but only once
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // ✅ Run only once when the component mounts

  useEffect(() => {
    updateTimeLeft(timeLeft); // ✅ Send updated time to parent
  }, [timeLeft, updateTimeLeft]); // ✅ Only when `timeLeft` changes

  // Format time (MM:SS)
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
