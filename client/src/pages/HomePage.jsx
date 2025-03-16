import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";

function HomePage({ moveToNextStep, allowedPath }) {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);

  // console.log("HomePage: ", allowedPath);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/getContents/all"
        );
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
    const sequence = shuffledContents.map((content) => content._id).join(",");
    const titles = shuffledContents.map((content) => content.title).join(",");

    const exerciseData = {
      studentId: studentData._id,
      sequence,
      titles,
      isDone: false,
      dateStarted: new Date().toISOString(),
    };

    try {
      const response = await axios.put(
        `http://localhost:3001/startExercise/${studentData._id}`,
        exerciseData
      );

      // console.log("Exercise updated or created:", response.data);
      moveToNextStep();
      navigate("/student/exercises");
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
                <a children="text-blue">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a children="text-blue">Home</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div
        className={`card card-${theme} shadow-lg rounded-lg text-center mx-auto`}
      >
        {/* Card Header */}
        <div
          className={`card-header ${
            theme === "dark"
              ? "bg-success-dark-mode text-white"
              : "bg-success text-white"
          } py-3 d-flex justify-content-center`}
        >
          <h2 className="card-title font-weight-bold m-0">
            🚀 Ready to Challenge Yourself?
          </h2>
        </div>

        <div
          className={`card-body text-center ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <p className="lead">
            Learning is a journey, and every test is a step forward. Stay
            confident, trust yourself, and give it your best! 💡✨
          </p>

          {/* Local Image */}
          <div className="my-3">
            <img
              src="https://source.unsplash.com/600x300/?study,learning"
              alt="Motivational Study"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          {/* Start Test Button */}
          <button
            className="btn btn-primary mt-3 px-4 py-2 rounded-lg shadow-sm"
            onClick={handleStartExercises}
            disabled={contents.length === 0}
          >
            {contents.length > 0
              ? "Start Your Test 📚"
              : "Preparing Your Test..."}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
