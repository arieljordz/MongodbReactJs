import React from "react";

const TimeDuration = ({ timeDuration, setTimeDuration }) => {
  return (
    <div className="mb-2">
      <label className="form-label">Time Duration (in minutes):</label>
      <input
        type="number"
        className="form-control"
        value={timeDuration}
        onChange={(e) => setTimeDuration(e.target.value)}
        placeholder="Enter minutes"
        min="1"
      />
    </div>
  );
};

export default TimeDuration;
