import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";
import Header from "../customPages/Header";

function HomePage({ moveToNextStep, allowedPath }) {
  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const {
    theme,
    toggleTheme,
    navBgColor,
    toggleNavBar,
    cardBgColor,
    btnBgColor,
  } = useTheme();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [isActiveCategory, setIsActiveCategory] = useState(null);
  const [progressExist, setProgressExist] = useState(false);

  // console.log("HomePage: ", allowedPath);
  console.log("studentData: ", studentData);
  // console.log("progress: ", progress);

  useEffect(() => {
    fetchProgress();
    fetchActiveCategory();
  }, []);

  const fetchActiveCategory = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/getCategoryActive/${studentData.category}`
      );
      setIsActiveCategory(response.data.isActive);
      // console.log("IsActiveCategory: ", response.data.isActive);
    } catch (error) {
      console.error("Error fetching active category:", error);
    }
  };

  const fetchData = async (isDone) => {
    const response = await axios.get(
      `${API_URL}/getProgress/${studentData._id}/${studentData.category}/${isDone}`
    );
    return response.data || null;
  };

  const fetchProgress = async () => {
    try {
      let progressData = await fetchData(false);

      console.log("Fetched not yet done progress:", progressData);

      if (!progressData) {
        progressData = await fetchData(true);
        console.log("Fetched done progress:", progressData);
        if (progressData) {
          setProgressExist(true);
        }
      }

      setProgress(progressData);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const createProgress = async (studentId, category) => {
    if (!studentId || !category) {
      console.error("Error: Missing studentId or category");
      return null; // ✅ Early return if invalid
    }

    try {
      const response = await axios.post(`${API_URL}/createProgress`,
        {
          studentId, // ✅ Send in the request body
          category,
        }
      );

      console.log("Created New Student Progress:", response.data);
      return response.data; // ✅ Return progress data
    } catch (error) {
      console.error("Error creating progress:", error);
      if (error.response?.status === 400) {
        fetchProgress();
      }
      return null;
    }
  };

  const handleStartExercises = async () => {
    try {
      if (isActiveCategory) {
        if (progressExist) {
          console.log("Progress already exists:", progressExist);
          moveToNextStep();
          navigate("/student/results");
        }

        if (!progress) {
          // ✅ Create progress if it doesn't exist
          const newProgress = await createProgress(
            studentData?._id,
            studentData?.category
          );
          if (newProgress) {
            setProgress(newProgress);
            console.log("Created and started new progress:", newProgress);
          }
        } else {
          console.log("Starting existing progress:", progress);
        }

        moveToNextStep();
        navigate("/student/exercises");
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("allowedPath");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error starting exercises:", error);
    }
  };

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Home" />
      <div
        className={`card card-${theme} shadow-lg rounded-lg text-center mx-auto`}
      >
        {/* Card Header */}
        <div
          className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
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
          {isActiveCategory ? (
            <p className="lead">
              Learning is a journey, and every test is a step forward. Stay
              confident, trust yourself, and give it your best! 💡✨
            </p>
          ) : (
            <p className="lead">
              Learning is a journey, and every test is a step forward. Stay
              confident, trust yourself, and give it your best! 💡✨
              <br />
              <br />
              Your selected category is inactive, please log in again using an
              active category. 🔄✅
            </p>
          )}

          {/* Start Test Button */}
          <button
            className={`btn ${btnBgColor} mt-3 px-4 py-2 rounded-lg shadow-sm`}
            onClick={handleStartExercises}
          >
            {isActiveCategory
              ? progressExist
                ? "Preview Exercises 📚"
                : progress
                ? "Continue Your Test 📚"
                : "Start Your Test 📚"
              : "👍 OK"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
