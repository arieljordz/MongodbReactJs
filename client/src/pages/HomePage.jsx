import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);

  // console.log("HomePage: ", studentData);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getContents/all");
        if (response.data.length > 0) {
          setContents(response.data);
        } else {
          console.warn("No contents available.");
        }
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    };

    fetchContents();
  }, []);

  // Shuffle function to randomize content order
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleStartExercises = async () => {
    if (!studentData._id || contents.length === 0) {
      console.error("Error: Missing studentId or no contents available");
      return;
    }
  
    // Shuffle contents and extract IDs & Titles
    const shuffledContents = shuffleArray([...contents]);
    const sequence = shuffledContents.map(content => content._id).join(",");
    const titles = shuffledContents.map(content => content.title).join(",");
  
    const exerciseData = {
      sequence,
      titles,
      dateStarted: new Date().toISOString(),
    };
  
    try {
      // Use PUT to update or create an exercise
      const response = await axios.put(
        `http://localhost:3001/updateOrCreateExercise/${studentData._id}`,
        exerciseData
      );
  
      console.log("Exercise updated or created:", response.data);
  
      navigate("/exercises", { state: { exerciseData: response.data } });
    } catch (error) {
      console.error("Error updating or creating exercise:", error);
    }
  };
  

  return (
    <div className={`container mt-6 ${theme}`}>
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a className="text-blue">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a className="text-blue">Home</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className={`card card-${theme}`}>
        <div className="card-header">
          <h3 className="card-title">Home</h3>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary mt-3"
              onClick={handleStartExercises}
              disabled={contents.length === 0} // Disable if no contents
            >
              {contents.length > 0 ? "Start Test" : "Loading..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
