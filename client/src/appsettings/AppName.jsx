import React from "react";

const AppName = ({ settings, appName, setAppName }) => {
  return (
    <div className="mb-2 text-left">
      <label className="form-label d-block text-start">Application Name:</label>
      <input
        type="text"
        className="form-control"
        value={appName === "" ? settings?.appName || "" : appName}
        onChange={(e) => setAppName(e.target.value)}
        placeholder="Enter Application Name"
      />
    </div>
  );
};

export default AppName;
