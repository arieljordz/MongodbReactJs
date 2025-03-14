import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import CreateQuestionModal from "../modals/QuestionModal";
import { useTheme } from "../customPages/ThemeContext";

function ResultPage() {
  const [contents, setContents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { theme } = useTheme();
  const [mode, setMode] = useState("ADD");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`container mt-6 ${theme}`}>
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="">Result</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className={`card card-${theme}`}>
        <div className="card-header">
          <h3 className="card-title">Results</h3>
        </div>
        {/* /.card-header */}
        <div className="card-body">body</div>
      </div>
    </div>
  );
}

export default ResultPage;
