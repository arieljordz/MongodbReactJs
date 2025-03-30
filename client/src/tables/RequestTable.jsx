import React from "react";

const RequestTable = ({
  requests,
  theme,
  onSubmitRequest,
  selectedRow,
  onRowClick,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className={theme === "dark" ? "table-dark" : "table-light"}>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((item, index) => (
              <tr
                key={item._id}
                className={
                  selectedRow === item._id
                    ? "table-primary cursor-pointer"
                    : "cursor-pointer"
                }
                onClick={(event) => onRowClick(item._id, event)}
              >
                <td className="text-center">{index + 1}</td>
                <td>
                  {`${item.studentId.firstname} ${
                    item.studentId.middlename
                      ? `${item.studentId.middlename.charAt(0)}.`
                      : ""
                  } ${item.studentId.lastname}`}
                </td>
                <td>
                  <span
                    className={`badge ${
                      item.isRetake === true
                        ? "bg-success"
                        : item.isRetake === null
                        ? "bg-danger"
                        : "bg-warning"
                    }`}
                  >
                    {item.isRetake === true
                      ? "Approved"
                      : item.isRetake === null
                      ? "Declined"
                      : "Pending"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center action-buttons">
                    <button
                      className="btn btn-success btn-sm mx-1"
                      onClick={() => onSubmitRequest(item._id, true, item)}
                      title="Approve"
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      onClick={() => onSubmitRequest(item._id, null, item)}
                      title="Decline"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No requests available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
