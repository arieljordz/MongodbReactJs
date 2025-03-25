import React from "react";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

const DownloadResults = ({ results, btnBgColor }) => {
  console.log("results:", results);

  // Function to export results to Excel
  const exportToExcel = () => {
    if (!results.length) {
      alert("No data available!");
      return;
    }

    // Get unique content titles dynamically
    const contentTitles = [
      ...new Set(results.flatMap((s) => s.contents.map((c) => c.contentTitle))),
    ];

    // Define header row dynamically
    const headers = [
      "#",
      "FULLNAME",
      ...contentTitles,
      "TOTAL ITEMS",
      "GRAND TOTAL",
      "PERCENTAGE",
      "STATUS",
    ];

    // Prepare the data for Excel
    const excelData = results.map((student, index) => {
      let grandTotal = 0;
      let totalItems = 0;
      let contentScores = {};

      student.contents.forEach((content) => {
        contentScores[content.contentTitle] = content.correctCount;
        grandTotal += content.correctCount;
        totalItems += content.totalCount;
      });

      const percentage = Math.round((grandTotal / totalItems) * 100); // Calculate percentage
      const status = percentage >= 75 ? "Passed" : "Failed";

      return {
        Number: index + 1,
        Fullname: student.studentName,
        ...contentTitles.reduce((acc, title) => {
          acc[title] = contentScores[title] || 0; // Fill missing scores with 0
          return acc;
        }, {}),
        TotalItems: totalItems,
        GrandTotal: grandTotal,
        Percentage: `${percentage}%`,
        Status: status,
      };
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(
      [headers, ...excelData.map((row) => Object.values(row))],
      { skipHeader: true }
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "Student_Results.xlsx");
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <button className={`btn ${btnBgColor}`} onClick={exportToExcel}>
          <i className="fas fa-file-excel"></i> Export to Excel
        </button>
      </div>
    </div>
  );
};

export default DownloadResults;
