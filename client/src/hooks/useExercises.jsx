import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";

const useExercises = () => {
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
  const [timeLeft, setTimeLeft] = useState(248);
  const [progress, setProgress] = useState(null);
  const [progressExist, setProgressExist] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentContent, setCurrentContent] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isLastQuestionInTopic, setIsLastQuestionInTopic] = useState(false);
  const [isLastTopic, setIsLastTopic] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
    if (progress && progress.progress?.length > 0) {
      const _currentContent = progress.progress[currentContentIndex] || null;
      const _currentQuestion =
        _currentContent?.answeredQuestions?.[currentQuestionIndex] || null;

      setCurrentContent(_currentContent);
      setCurrentQuestion(_currentQuestion);
    }
  }, [progress, currentContentIndex, currentQuestionIndex]);

  const handleCheckboxChange = (answer) => {
    setSelectedAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((a) => a !== answer)
        : [...prev, answer]
    );
  };

  const handleTimeUp = () => {
    toast.error("Time is up! Submitting automatically.", { autoClose: 2000 });
    navigate("/student/congrats");
  };

  // ✅ Function to update `timeLeft` from Timer every second
  const handleTimeUpdate = (newTime) => {
    setTimeLeft(newTime);

    // ✅ Update only every 30 seconds to prevent excessive API calls
    if (Date.now() - lastUpdateTime >= 30000) {
      updateTimeLeft(newTime);
      setLastUpdateTime(Date.now());
    }
  };

  // ✅ Function to update time in the database
  const updateTimeLeft = async (newTime) => {
    // console.log("newTimeleft:", newTime);
    try {
      await axios.put(`http://localhost:3001/updateTimeLeft/${progress._id}`, {
        timeLeft: newTime,
      });
    } catch (error) {
      console.error("Failed to update timeLeft:", error);
    }
  };

  const fetchData = async (isDone) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getProgress/${studentData._id}/${studentData.category}/${isDone}`
      );
      console.log(
        `Fetched ${isDone ? "done" : "not yet done"} progress:`,
        response.data
      );
      return response.data || null; // ✅ Ensure data is returned
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchProgress = useCallback(async () => {
    try {
      let progressData = await fetchData(false);

      if (!progressData) {
        progressData = await fetchData(true);
        setProgressExist(!!progressData);
      }

      if (progressData) {
        setProgress(progressData);
        setTimeLeft(progressData.timeLeft || 0);
        console.log("timeLeft:", progressData.timeLeft);

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
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [studentData]);

  useEffect(() => {
    if (studentData?._id && studentData?.category) {
      fetchProgress();
    }

    if (timeLeft) {
      setTimeLeft(parseInt(timeLeft, 10));
    }
  }, [fetchProgress]);

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

  // const _currentContent = progress.progress?.[currentContentIndex];
  // setCurrentContent(_currentContent);
  // const _currentQuestion =
  //   _currentContent?.answeredQuestions?.[currentQuestionIndex];
  // setCurrentQuestion(_currentQuestion);

  // console.log("_currentContent:", _currentContent);

  return {
    theme,
    navigate,
    timeLeft,
    setTimeLeft,
    progress,
    setProgress,
    progressExist,
    setProgressExist,
    currentContentIndex,
    setCurrentContentIndex,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswers,
    setSelectedAnswers,
    isLastQuestionInTopic,
    setIsLastQuestionInTopic,
    isLastTopic,
    setIsLastTopic,
    lastUpdateTime,
    setLastUpdateTime,
    handleCheckboxChange,
    handleTimeUp,
    handleTimeUpdate,
    updateTimeLeft,
    fetchProgress,
    handleSubmitAnswer,
    handlePreviewNextTopic,
    handleNextTopic,
    handleFinish,
    currentContent,
    currentQuestion,
    cardBgColor,
    btnBgColor,
  };
};

export default useExercises;
