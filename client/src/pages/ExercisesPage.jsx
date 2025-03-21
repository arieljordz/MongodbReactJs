import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import Timer from "../customPages/Timer";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Header from "../customPages/Header";

function ExercisesPage({ moveToNextStep, allowedPath }) {
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
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(null);
  const [progressExist, setProgressExist] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // const [currentContent, setcurrentContent] = useState(null);
  // const [currentQuestion, setcurrentQuestion] = useState(null);
  const [isLastQuestionInTopic, setIsLastQuestionInTopic] = useState(false);
  const [isLastTopic, setIsLastTopic] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // ✅ Restore `timeLeft` from localStorage on page refresh
  useEffect(() => {
    fetchProgress();
    if (timeLeft) {
      setTimeLeft(parseInt(timeLeft, 10));
    }
  }, []);

  const handleCheckboxChange = (answer) => {
    setSelectedAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((a) => a !== answer)
        : [...prev, answer]
    );
  };

  const handleTimeUp = () => {
    Swal.fire({
      title: "Time's Up!",
      text: "Your test time has expired. Click OK to view your results.",
      icon: "info",
      confirmButtonText: "OK",
      allowOutsideClick: false, // Prevents closing by clicking outside
      allowEscapeKey: false, // Prevents closing with the "Escape" key
      allowEnterKey: false, // Prevents closing by pressing "Enter"
    }).then(() => {
      moveToNextStep();
      navigate("/student/results");
    });
  };

  const fetchData = async (isDone) => {
    const response = await axios.get(
      `http://localhost:3001/getProgress/${studentData._id}/${studentData.category}/${isDone}`
    );
    return response.data || null;
  };

  const fetchProgress = async () => {
    try {
      let progressData = await fetchData(false);

      // console.log("Fetched not yet done progress:", progressData);

      if (!progressData) {
        progressData = await fetchData(true);
        // console.log("Fetched done progress:", progressData);
        setProgressExist(true);
      }

      setProgress(progressData);
      setTimeLeft(progressData?.timeLeft || timeLeft);

      if (progressData?.progress?.length > 0) {
        const { topicIndex, questionIndex } = findNextUnansweredQuestion(
          progressData.progress
        );

        setCurrentContentIndex(topicIndex);
        setCurrentQuestionIndex(questionIndex);
      } else {
        setCurrentContentIndex(0);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // ✅ Finds the next unanswered question across topics
  const findNextUnansweredQuestion = (progressArray) => {
    for (let topicIndex = 0; topicIndex < progressArray.length; topicIndex++) {
      const topic = progressArray[topicIndex];

      if (!topic?.answeredQuestions) continue;

      const unansweredIndex = topic.answeredQuestions.findIndex(
        (q) => !q.isDone
      );

      if (unansweredIndex !== -1) {
        return { topicIndex, questionIndex: unansweredIndex };
      }
    }

    return { topicIndex: 0, questionIndex: 0 }; // Default to first question if all are answered
  };

  // ✅ Handles answer submission and moves to the next unanswered question
  const handleSubmitAnswer = async () => {
    if (!progress) return;

    if (selectedAnswers.length === 0) {
      toast.error("Please select at least one answer before submitting.");
      return;
    }

    const updatedProgress = JSON.parse(JSON.stringify(progress));

    const currentContent = updatedProgress.progress?.[currentContentIndex];
    const currentQuestion =
      currentContent?.answeredQuestions?.[currentQuestionIndex];

    if (!currentContent || !currentQuestion) return;

    // ✅ Mark question as done and save selected answers
    currentQuestion.isDone = true;
    currentQuestion.selectedAnswers = selectedAnswers;

    // ✅ Check correctness
    const correctAnswers = ["A", "B", "C", "D"].filter(
      (ans) => currentQuestion.questionId?.[`answer${ans}Check`]
    );

    currentQuestion.isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((ans) => correctAnswers.includes(ans));

    currentQuestion.isPartiallyCorrect =
      selectedAnswers.some((ans) => correctAnswers.includes(ans)) &&
      !currentQuestion.isCorrect;

    displayResultToast(
      currentQuestion.isCorrect,
      currentQuestion.isPartiallyCorrect
    );

    // ✅ Find the next unanswered question or move to the next topic
    let { topicIndex, questionIndex } = findNextUnansweredQuestion(
      updatedProgress.progress
    );

    const allTopicsDone = updatedProgress.progress.every((topic) =>
      topic.answeredQuestions.every((question) => question.isDone)
    );

    updatedProgress.isDone = allTopicsDone; // ✅ Set global `isDone` flag
    console.log("allTopicsDone:", allTopicsDone);
    // ✅ Save the remaining time in progress
    updatedProgress.timeLeft = timeLeft;

    // console.log("updatedProgress:", updatedProgress);
    setProgress(updatedProgress);
    setSelectedAnswers([]);
    setCurrentContentIndex(topicIndex);
    setCurrentQuestionIndex(questionIndex);
    console.log("topicIndex:", topicIndex);
    // console.log("questionIndex:", questionIndex);

    // ✅ Determine if this is the last question in the current topic
    const _currentContent = updatedProgress.progress?.[currentContentIndex];
    const _isLastQuestionInTopic =
      _currentContent?.answeredQuestions?.every((q) => q.isDone) ?? false;

    setIsLastQuestionInTopic(_isLastQuestionInTopic);
    console.log("_isLastQuestionInTopic:", _isLastQuestionInTopic);

    const _isLastTopic =
      currentContentIndex === updatedProgress.progress.length - 1;
    setIsLastTopic(_isLastTopic);
    console.log("_isLastTopic:", _isLastTopic);

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

  // ✅ Moves to the next preview topic
  const handlePreviewNextTopic = (isDone) => {
    console.log("CurrentContentIndex:", currentContentIndex);
    setCurrentContentIndex((prevIndex) =>
      Math.min(prevIndex + 1, progress.progress.length - 1)
    );
    setCurrentQuestionIndex(0);
    setIsLastQuestionInTopic(false);
    if (isDone) {
      moveToNextStep();
      navigate("/student/results");
    }
  };

  // ✅ Moves to the next topic
  const handleNextTopic = () => {
    setCurrentContentIndex((prevIndex) =>
      Math.min(prevIndex, progress.progress.length - 1)
    );
    setCurrentQuestionIndex(0);
    setIsLastQuestionInTopic(false);
  };

  // ✅ Finishes the test and navigates to results
  const handleFinish = () => {
    moveToNextStep();
    navigate("/student/results");
  };

  // ✅ Displays result messages
  const displayResultToast = (isCorrect, isPartiallyCorrect) => {
    if (isCorrect) {
      toast.success("🎉 Correct answer!");
    } else if (isPartiallyCorrect) {
      toast.info("⚠️ Partially correct! Some answers are right.");
    } else {
      toast.error("❌ Incorrect answer. Try again!");
    }
  };

  // ✅ Display loading state if progress is not yet loaded
  if (!progress) return <p>Loading...</p>;

  const currentContent = progress.progress?.[currentContentIndex];
  const currentQuestion =
    currentContent?.answeredQuestions?.[currentQuestionIndex];
  // ✅ Determine if this is the last question in the current topic
  // const isLastQuestionInTopic = currentContent?.answeredQuestions?.every((q) => q.isDone) ?? false;
  // const isLastTopic = currentContentIndex === progress.progress.length - 1;

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Exercises" />
      <div className={`card card-${theme} shadow-lg rounded-lg mx-auto`}>
        <div
          className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
        >
          <h2 className="card-title font-weight-bold m-0">
            📚 Reading Comprehension
          </h2>
        </div>

        <>
          {!progressExist ? (
            <div className="d-flex justify-content-end mt-2 me-3">
              <Timer
                progressId={progress._id}
                onTimeUp={handleTimeUp}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
              />
            </div>
          ) : null}
        </>

        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          {progressExist ? (
            <PreviewContents
              currentContent={currentContent}
              handlePreviewNextTopic={handlePreviewNextTopic}
              isLastContent={
                currentContentIndex === progress.progress.length - 1
              }
              btnBgColor={btnBgColor}
            />
          ) : (
            <>
              <ContentDisplay
                currentContent={currentContent}
                isLastQuestionInTopic={isLastQuestionInTopic}
                isLastTopic={isLastTopic}
              />
              <QuestionDisplay
                currentQuestion={currentQuestion}
                selectedAnswers={selectedAnswers}
                handleCheckboxChange={handleCheckboxChange}
                isLastQuestionInTopic={isLastQuestionInTopic}
              />
              <ActionButtons
                isLastQuestionInTopic={isLastQuestionInTopic}
                isLastTopic={isLastTopic}
                handleSubmitAnswer={handleSubmitAnswer}
                handleNextTopic={handleNextTopic}
                handleFinish={handleFinish}
                btnBgColor={btnBgColor}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const PreviewContents = ({
  currentContent,
  handlePreviewNextTopic,
  isLastContent,
  btnBgColor,
}) => {
  return (
    <>
      <div className="mb-3">
        <h3 className="text-center">
          {currentContent?.contentId?.title || "Untitled"}
        </h3>
        <p
          dangerouslySetInnerHTML={{
            __html:
              currentContent?.contentId?.description ||
              "No description available.",
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
      <div className="d-flex justify-content-center mt-3">
        <button
          className={`btn ${btnBgColor} px-4 py-2 rounded-lg shadow-sm`}
          onClick={() => handlePreviewNextTopic(isLastContent)}
        >
          🚀 {isLastContent ? "Finish" : "Next Topic"}
        </button>
      </div>
    </>
  );
};

const ContentDisplay = ({
  currentContent,
  isLastQuestionInTopic,
  isLastTopic,
}) => {
  return (
    <>
      {!isLastQuestionInTopic ? (
        <div className="mb-3">
          <h3 className="text-center">
            {currentContent.contentId?.title || "Untitled"}
          </h3>
          <p
            className="text-justify"
            style={{ textAlign: "justify", textIndent: "2em" }}
            dangerouslySetInnerHTML={{
              __html:
                currentContent.contentId?.description ||
                "No description available.",
            }}
          ></p>

          {/* {currentContent.contentId?.link && (
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
          )} */}
          {currentContent.contentId?.link && (
            <div>
              <strong>Reference:</strong>
              {currentContent.contentId.link.includes("youtube.com") ||
              currentContent.contentId.link.includes("youtu.be") ? (
                // Responsive Video Embed
                <div className="video-container">
                  <iframe
                    src={currentContent.contentId.link.replace(
                      "watch?v=",
                      "embed/"
                    )}
                    title="Video Reference"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                // Display as a normal link if it's not a YouTube video
                <p>
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
          )}
        </div>
      ) : (
        <>
          {!isLastTopic ? (
            <div className="mb-3">
              <p className="lead text-center">
                🚀 Great work! Ready for the next challenge? Click 'Next Topic'
                to keep going! 🔥🎯
              </p>
            </div>
          ) : (
            <div className="mb-3">
              <p className="lead text-center">
                🎉 Awesome job! You've completed all the topics! Click 'Finish'
                to see your results and celebrate your progress! 🏆🚀
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

const QuestionDisplay = ({
  currentQuestion,
  selectedAnswers,
  handleCheckboxChange,
  isLastQuestionInTopic,
}) => {
  if (isLastQuestionInTopic || !currentQuestion?.questionId) return null; // Don't render if last question

  return (
    <>
      <div className="mb-3 text-start">
        <p>
          <strong>Question:</strong> {currentQuestion.questionId.question}
        </p>
      </div>

      <div className="text-start">
        {["A", "B", "C", "D"].map((option) => {
          const answerText = currentQuestion.questionId[`answer${option}`];
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
  );
};

const ActionButtons = ({
  isLastQuestionInTopic,
  isLastTopic,
  handleSubmitAnswer,
  handleNextTopic,
  handleFinish,
  btnBgColor,
}) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      {!isLastQuestionInTopic ? (
        <button
          className={`btn ${btnBgColor} px-4 py-2 rounded-lg shadow-sm`}
          onClick={handleSubmitAnswer}
        >
          🚀 Submit Answer
        </button>
      ) : (
        <>
          {!isLastTopic ? (
            <button
              className={`btn ${btnBgColor} px-4 py-2 rounded-lg shadow-sm`}
              onClick={handleNextTopic}
            >
              🚀 Next Topic
            </button>
          ) : (
            <button
              className={`btn ${btnBgColor} px-4 py-2 rounded-lg shadow-sm`}
              onClick={handleFinish}
            >
              🏆 Finish
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ExercisesPage;
