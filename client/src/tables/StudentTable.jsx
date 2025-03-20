import React from "react";

const StudentTable = ({ students, theme, onDelete, onUpdate, onSort, sortConfig, selectedRow, onRowClick }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className={theme === "dark" ? "table-dark" : "table-light"}>
          <tr>
            <th>#</th>
            <th onClick={() => onSort("firstname")} className="cursor-pointer">
              First Name {sortConfig?.key === "firstname" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Middle Name</th>
            <th onClick={() => onSort("lastname")} className="cursor-pointer">
              Last Name {sortConfig?.key === "lastname" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => onSort("email")} className="cursor-pointer">
              Email {sortConfig?.key === "email" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => onSort("userType")} className="cursor-pointer">
              Role {sortConfig?.key === "userType" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr
                key={student._id}
                className={selectedRow === student._id ? "table-primary cursor-pointer" : "cursor-pointer"}
                onClick={(event) => onRowClick(student._id, event)}
              >
                <td className="text-center">{index + 1}</td>
                <td>{student.firstname}</td>
                <td>{student.middlename}</td>
                <td>{student.lastname}</td>
                <td>{student.email}</td>
                <td>{student.userType}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center action-buttons">
                    <button className="btn btn-primary btn-sm mx-1" onClick={() => onUpdate(student)} title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm mx-1" onClick={() => onDelete(student._id)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No students available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
