import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function DataTable() {
  // Sample Data
  const initialData = [
    { id: 1, name: "John Doe", email: "john@example.com", age: 28 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", age: 32 },
    { id: 3, name: "Mark Johnson", email: "mark@example.com", age: 25 },
    { id: 4, name: "Sarah Brown", email: "sarah@example.com", age: 30 },
    { id: 5, name: "Mike Davis", email: "mike@example.com", age: 27 },
  ];

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Search Function
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting Function
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Sorting Handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Bootstrap 5.3 DataTable</h2>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Bootstrap Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Email</th>
            <th onClick={() => handleSort("age")} style={{ cursor: "pointer" }}>
              Age {sortConfig.key === "age" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.age}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
