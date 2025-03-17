import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import Timer from "../customPages/Timer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ExercisesPage({ moveToNextStep, allowedPath }) {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const navigate = useNavigate();
  const totalTime = 10 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progress, setProgress] = useState(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const storedProgress = JSON.parse(localStorage.getItem("progress"));
      if (storedProgress) {
        setProgress(storedProgress);
        setCurrentContentIndex(storedProgress.currentContentIndex || 0);
        setCurrentQuestionIndex(storedProgress.currentQuestionIndex || 0);
        setTimeLeft(storedProgress.timeLeft || totalTime); // ✅ Restore timeLeft
        console.log("Restored progress from localStorage:", storedProgress);
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/getProgress/${studentData._id}/${studentData.category}`
      );

      setProgress(response.data);
      setTimeLeft(response.data.timeLeft || totalTime); // ✅ Set timeLeft from API
      localStorage.setItem("progress", JSON.stringify(response.data));
      console.log("Fetched and saved progress:", response.data);
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress.");
    }
  };

  const handleTimeUp = () => {
    toast.error("Time is up! Submitting automatically.", { autoClose: 2000 });
    navigate("/student/congrats");
  };

  // ✅ Function to update `timeLeft` from Timer every second
  const handleTimeUpdate = (newTime) => {
    setTimeLeft(newTime);
    localStorage.setItem("timeLeft", newTime); // ✅ Save timeLeft periodically
  };

  // ✅ Restore `timeLeft` from localStorage on page refresh
  useEffect(() => {
    const savedTimeLeft = localStorage.getItem("timeLeft");
    if (savedTimeLeft) {
      setTimeLeft(parseInt(savedTimeLeft, 10));
    }
  }, []);

  useEffect(() => {
    const saveTimeToAPI = setInterval(async () => {
      try {
        await axios.put(`http://localhost:3001/updateTime/${progress._id}`, { timeLeft });
      } catch (error) {
        console.error("Error updating time:", error);
      }
    }, 10000); // ✅ Update API every 10 seconds
  
    return () => clearInterval(saveTimeToAPI); // ✅ Cleanup on unmount
  }, [timeLeft]);

  const handleCheckboxChange = (answer) => {
    setSelectedAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((a) => a !== answer)
        : [...prev, answer]
    );
  };

  const handleSubmitAnswer = async () => {
    if (!progress) return;

    if (selectedAnswers.length === 0) {
      toast.error("Please select at least one answer before submitting.");
      return;
    }

    const updatedProgress = { ...progress };
    const currentContent = updatedProgress.progress[currentContentIndex];
    const currentQuestion =
      currentContent.answeredQuestions[currentQuestionIndex];

    currentQuestion.isDone = true;
    currentQuestion.selectedAnswers = selectedAnswers;

    const correctAnswers = ["A", "B", "C", "D"].filter(
      (ans) => currentQuestion.questionId[`answer${ans}Check`]
    );

    console.log("currentQuestion: ", currentQuestion.questionId.question);
    console.log("selectedAnswers: ", selectedAnswers);
    console.log("correctAnswers:", correctAnswers);

    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((ans) => correctAnswers.includes(ans));

    const isPartiallyCorrect =
      selectedAnswers.some((ans) => correctAnswers.includes(ans)) && !isCorrect;

    currentQuestion.isCorrect = isCorrect;
    currentQuestion.isPartiallyCorrect = isPartiallyCorrect;

    if (isCorrect) {
      toast.success("🎉 Correct answer!");
    } else if (isPartiallyCorrect) {
      toast.info("⚠️ Partially correct! Some answers are right.");
    } else {
      toast.error("❌ Incorrect answer. Try again!");
    }

    setSelectedAnswers([]);

    // ✅ Move to next question or mark topic as completed
    if (currentQuestionIndex < currentContent.answeredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      currentContent.isDone = true;
      toast.info("🎉 Topic completed! Click 'Next Topic' to continue.");
    }

    // ✅ Save the remaining time in progress
    updatedProgress.timeLeft = timeLeft;

    setProgress(updatedProgress);

    // ✅ Save progress to localStorage
    localStorage.setItem(
      "progress",
      JSON.stringify({
        ...updatedProgress,
        timeLeft,
        currentContentIndex,
        currentQuestionIndex:
          currentQuestionIndex < currentContent.answeredQuestions.length - 1
            ? currentQuestionIndex + 1
            : 0,
      })
    );

    try {
      await axios.put(
        `http://localhost:3001/updateProgress/${progress._id}`,
        updatedProgress
      );
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress.");
    }
  };

  const handleNextTopic = () => {
    if (currentContentIndex < progress.progress.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFinish = () => {
    localStorage.removeItem("progress"); // 🔥 Clear saved progress on finish
    moveToNextStep();
    toast.success("🎉 You have completed all topics!");
    navigate("/student/congrats");
  };

  if (!progress) return <p>Loading...</p>;

  const currentContent = progress.progress[currentContentIndex] || {};

  const currentQuestion =
    progress.progress[currentContentIndex]?.answeredQuestions[
      currentQuestionIndex
    ];

  const isLastQuestionInTopic =
    currentContent?.answeredQuestions &&
    currentContent.answeredQuestions.every((q) => q.isDone);

  const isLastTopic = currentContentIndex === progress.progress.length - 1;

  // console.log("currentContent:", currentContent); // Debugging

  return (
    <div className={`container mt-6 ${theme}`}>
      <div className="content-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a className="text-blue">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a className="text-blue">Exercises</a>
            </li>
          </ol>
        </nav>
      </div>

      <div className={`card card-${theme} shadow-lg rounded-lg mx-auto`}>
        <div
          className={`card-header ${
            theme === "dark"
              ? "bg-success-dark-mode text-white"
              : "bg-success text-white"
          } py-3`}
        >
          <h2 className="card-title font-weight-bold m-0">
            📚 Reading Comprehension
          </h2>
        </div>

        <div className="d-flex justify-content-end mt-2 me-3">
          <Timer
            duration={timeLeft}
            onTimeUp={handleTimeUp}
            updateTimeLeft={handleTimeUpdate}
          />
        </div>

        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <div className="mb-3">
            <h3 className="text-center">
              {currentContent.contentId?.title || "Untitled"}
            </h3>
            <p
              className="text-justify"
              style={{ textAlign: "justify", textIndent: "2em" }}
              dangerouslySetInnerHTML={{
                __html: currentContent.contentId?.description,
              }}
            ></p>

            {currentContent.contentId?.link && (
              <p>
                <strong>Reference:</strong>{" "}
                <a
                  href={currentContent.contentId.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentContent.contentId.link}
                </a>
              </p>
            )}
          </div>

          {/* Show Question & Answer only when NOT the last question in the topic */}
          {!isLastQuestionInTopic && currentQuestion?.questionId ? (
            <>
              <div className="mb-3 text-start">
                <p>
                  <strong>Question:</strong>{" "}
                  {currentQuestion.questionId.question}
                </p>
              </div>

              <div className="text-start">
                {["A", "B", "C", "D"].map((option) => {
                  const answerText =
                    currentQuestion.questionId[`answer${option}`];
                  const isChecked = selectedAnswers.includes(option);

                  return (
                    <div key={option} className="form-check mb-2">
                      <input
                        type="checkbox"
                        id={`answer-${option}`}
                        className="form-check-input"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option)}
                      />
                      <label
                        className="form-check-label ms-2 cursor-pointer"
                        htmlFor={`answer-${option}`}
                      >
                        {option}: {answerText}
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          {/* Show Submit Answer Button until the last question is answered */}
          {!isLastQuestionInTopic ? (
            <button
              className="btn btn-primary mt-3 px-4 py-2 rounded-lg shadow-sm"
              onClick={handleSubmitAnswer}
            >
              🚀 Submit Answer
            </button>
          ) : (
            <>
              {/* Show "Next Topic" button if it's NOT the last topic */}
              {!isLastTopic ? (
                <button
                  className="btn btn-success bg-success-dark-mode mt-3 px-4 py-2 rounded-lg shadow-sm"
                  onClick={handleNextTopic}
                >
                  ➡ Next Topic
                </button>
              ) : (
                <button
                  className="btn btn-success mt-3 px-4 py-2 rounded-lg shadow-sm"
                  onClick={handleFinish}
                >
                  🏆 Finish
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExercisesPage;
