import React from "react";

const TimeDuration = ({ settings, timeDuration, setTimeDuration }) => {
  return (
    <div className="mb-2 text-left">
      <label className="form-label d-block text-start">
        Time Duration (in minutes):
      </label>
      <input
        type="number"
        className="form-control"
        value={timeDuration === "" ? settings?.timeDuration || "" : timeDuration}
        onChange={(e) => setTimeDuration(e.target.value)}
        placeholder="Enter minutes"
        min="1"
      />
    </div>
  );
};

export default TimeDuration;
