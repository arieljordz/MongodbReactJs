import React, { useState } from "react";

const QuestionTable = ({
  questionsData,
  theme,
  toggleExpand,
  expanded,
  setExpanded,
  onRowClick,
  onUpdate,
  onDelete,
  selectedRow,
  setSelectedRow,
}) => {
  return (
    <div className="accordion" id="questionsAccordion">
      {Object.values(questionsData).map((group, index) => {
        if (!group || !group.content) {
          console.error("Missing content for group:", group);
          return null;
        }

        const { content, questions } = group;

        return (
          <div className="card mb-2" key={content._id || index}>
            <div
              className="card-header d-flex align-items-center"
              onClick={() => toggleExpand(content._id)}
              style={{ cursor: "pointer" }}
            >
              <h5 className="mb-0">
                {index + 1}. {content.title.toUpperCase() || "Untitled"}
              </h5>

              <i
                className={`fas ${
                  expanded[content._id] ? "fa-chevron-up" : "fa-chevron-down"
                } ms-auto`}
              />
            </div>
            {expanded[content._id] && questions && (
              <div className="card-body pt-0">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead
                      className={
                        theme === "dark" ? "table-dark" : "table-light"
                      }
                    >
                      <tr>
                        <th className="text-center">#</th>
                        <th>Question</th>
                        <th>Letter A</th>
                        <th>Letter B</th>
                        <th>Letter C</th>
                        <th>Letter D</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((q, rowIndex) => (
                        <tr
                          key={q._id}
                          className={
                            selectedRow === q._id
                              ? "table-primary cursor-pointer"
                              : "cursor-pointer"
                          }
                          onClick={(event) => onRowClick(q._id, event)}
                        >
                          <td className="text-center">{rowIndex + 1}</td>
                          <td>{q.question}</td>
                          <td>{q.answerA}</td>
                          <td>{q.answerB}</td>
                          <td>{q.answerC}</td>
                          <td>{q.answerD}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center action-buttons">
                              <button
                                className="btn btn-primary btn-sm mx-1"
                                onClick={() => onUpdate(q, content._id)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-sm mx-1"
                                onClick={() => onDelete(q._id, content._id)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionTable;
