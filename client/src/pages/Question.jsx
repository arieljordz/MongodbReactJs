import React from "react";
import { useLocation } from "react-router-dom";
import ContentTable from "../customPages/ContentTable";

function Question() {
  const location = useLocation();
  const { selectedItem, contents, fetchContents } = location.state || {};
  // console.log(fetchContents);
  return (
    <div className="container mt-3">
      {/* Render ContentTable and pass props */}
      {/* <ContentTable
        data={contents || []}
        setSelectedContent={() => {}}
        fetchContents={fetchContents}
      /> */}
      <label htmlFor="title" className="form-label fw-bold">
        {`Title: ${selectedItem?.title || "No Title Available"}`}
      </label>
    </div>
  );
}

export default Question;
