import React from "react";

const ContentTable = ({ contents, theme, onDelete, onUpdate, onSort, sortConfig, selectedRow, onRowClick }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className={theme === "dark" ? "table-dark" : "table-light"}>
          <tr>
            <th>#</th>
            <th onClick={() => onSort("title")} className="cursor-pointer">
              Title {sortConfig?.key === "title" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => onSort("description")} className="cursor-pointer">
              Description {sortConfig?.key === "description" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => onSort("link")} className="cursor-pointer">
              Link {sortConfig?.key === "link" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => onSort("category")} className="cursor-pointer">
              Category {sortConfig?.key === "category" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contents.length > 0 ? (
            contents.map((item, index) => (
              <tr
                key={item._id}
                className={selectedRow === item._id ? "table-primary cursor-pointer" : "cursor-pointer"}
                onClick={(event) => onRowClick(item._id, event)}
              >
                <td className="text-center">{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.link}</td>
                <td>{item.category}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center action-buttons">
                    <button className="btn btn-primary btn-sm mx-1" onClick={() => onUpdate(item)} title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm mx-1" onClick={() => onDelete(item._id)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No contents available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;
