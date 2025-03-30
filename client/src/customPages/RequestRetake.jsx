import React, { useState, useEffect } from "react";
import RequestModal from "../modals/RequestModal";

const RequestRetake = ({
  theme,
  showModal,
  onClose,
  onSubmitRequest,
  onRowClick,
  selectedRow,
  requests,
  btnBgColor,
}) => {
  console.log("requests:", requests);
  return (
    <div>
      <button
        className={`btn ${btnBgColor} me-2`}
        onClick={() => onClose(true)}
      >
        <i className="fas fa-file-excel"></i> Retake Requests
      </button>
      <RequestModal
        theme={theme}
        showModal={showModal}
        onClose={onClose}
        onSubmitRequest={onSubmitRequest}
        onRowClick={onRowClick}
        selectedRow={selectedRow}
        requests={requests}
        btnBgColor={btnBgColor}
      />
    </div>
  );
};

export default RequestRetake;
