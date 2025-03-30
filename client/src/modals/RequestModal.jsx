import React from "react";
import RequestTable from "../tables/RequestTable";

const RequestModal = ({
  theme,
  showModal,
  onClose,
  onSubmitRequest,
  onRowClick,
  selectedRow,
  requests,
  btnBgColor,
}) => {
  return (
    <div
      className={`modal fade ${showModal ? "show d-block" : ""} ${theme}`}
      tabIndex={-1}
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Retake Request</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => onClose(false)}
            ></button>
          </div>
          <div className="modal-body">
            <RequestTable
              requests={requests}
              theme={theme}
              onSubmitRequest={onSubmitRequest}
              selectedRow={selectedRow}
              onRowClick={onRowClick}
            />
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
