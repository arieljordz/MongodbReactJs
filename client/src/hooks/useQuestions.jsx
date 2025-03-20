import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

const useQuestions = () => {
  const { theme } = useTheme();
  const [contents, setContents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("ADD");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [expanded, setExpanded] = useState({});
  const initialFormState = {
    question: "",
    answerA: "",
    answerACheck: false,
    answerB: "",
    answerBCheck: false,
    answerC: "",
    answerCCheck: false,
    answerD: "",
    answerDCheck: false,
    contentId: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchQuestions();
    fetchContents();
  }, []);

  useEffect(() => {
    if (selectedQuestion) {
      setFormData(selectedQuestion);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedQuestion]);

  const fetchContents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getContents/all");
      setContents(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getQuestions/all"
      );
      const groupedQuestions = response.data.reduce((acc, question) => {
        const { contentId } = question;
        if (!acc[contentId._id]) {
          acc[contentId._id] = { content: contentId, questions: [] };
        }
        acc[contentId._id].questions.push(question);
        return acc;
      }, {});
      setQuestions(groupedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }, []);

  // Open Modal for Add/Edit
  const handleOpenModal = (question = null, contentId) => {
    // console.log("question:",question);
    // console.log("contentId:",contentId);
    if (question) {
      if (!selectedRow) {
        toast.warning("Please select a row before updating.");
        return;
      }
      if (selectedRow !== question._id) {
        toast.warning("Please click the action button on the selected row.");
        return;
      }
      setMode("EDIT");
      setSelectedQuestion(question);
    } else {
      setMode("ADD");
      setSelectedQuestion(null);
      setSelectedRow(null);
    }
    setShowModal(true);
  };

  // Toggle expand/collapse
  const toggleExpand = (contentId) => {
    setExpanded((prev) => ({ ...prev, [contentId]: !prev[contentId] }));
  };

  // Handle row selection (excluding action buttons)
  const handleRowClick = (questionId, event) => {
    if (event.target.closest(".action-buttons")) return; // Ignore action buttons
    setSelectedRow((prev) => (prev === questionId ? null : questionId));
    console.log("selectedRow ID:", questionId);
  };

  // Handle Delete
  const handleDelete = async (questionId, contentId) => {
    if (!selectedRow) {
      toast.warning("Please select a row before deleting.");
      return;
    }
    if (selectedRow !== questionId) {
      toast.warning("Please click the action button on the selected row.");
      return;
    }
    try {
      const isYesNo = await Swal.fire({
        title: "Confirmation",
        text: "Are you sure you want to delete this record?",
        icon: "question",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "Yes, Delete it",
        cancelButtonText: "Cancel",
      });
      // console.log(isYesNo.isConfirmed);
      if (isYesNo.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3001/deleteQuestion/${questionId}`
        );
        setMode("DELETE");
        if (response.status === 200) {
          toast.success("Question successfully deleted.", {
            autoClose: 2000,
            position: "top-right",
            closeButton: true,
          });

          fetchQuestions();
        }
      }
    } catch (error) {
      console.error("Error deleting question:", error);

      toast.error(
        error.response?.data?.message || "Error while deleting question.",
        {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        }
      );
    }
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedQuestion) {
      return toast.warning("Please select a title first.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    }

    if (
      !formData.answerACheck &&
      !formData.answerBCheck &&
      !formData.answerCCheck &&
      !formData.answerDCheck
    ) {
      return toast.warning("Please select at least one correct answer.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    }

    try {
      const sanitizedFormData = {
        question: formData.question || "",
        answerA: formData.answerA || "",
        answerACheck: !!formData.answerACheck,
        answerB: formData.answerB || "",
        answerBCheck: !!formData.answerBCheck,
        answerC: formData.answerC || "",
        answerCCheck: !!formData.answerCCheck,
        answerD: formData.answerD || "",
        answerDCheck: !!formData.answerDCheck,
        contentId: selectedQuestion?._id || formData.contentId || "",
      };

      const headers = { headers: { "Content-Type": "application/json" } };

      if (mode === "ADD") {
        console.log("Add payload:", sanitizedFormData);
        await axios.post(
          "http://localhost:3001/createQuestionByContent",
          sanitizedFormData,
          headers
        );
        toast.success("Question added successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        const updatePayload = {
          ...sanitizedFormData,
          _id: formData._id,
          contentId: selectedQuestion.contentId._id,
        };
        console.log("Update payload:", updatePayload);
        await axios.put(
          `http://localhost:3001/updateQuestion/${formData._id}`,
          updatePayload,
          headers
        );
        toast.success("Question updated successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
        setShowModal(false);
      }

      fetchQuestions();
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add/update question. Please try again."
      );
    }

    setSelectedRow(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedQuestion(null);
    setFormData(initialFormState);
    setSelectedRow(null);
  };

  return {
    theme,
    contents,
    questions,
    fetchQuestions,
    toggleExpand,
    expanded,
    setExpanded,
    handleDelete,
    handleRowClick,
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    setFormData,
    selectedRow,
    setSelectedRow,
    handleOpenModal,
    selectedQuestion,
    setSelectedQuestion,
    showModal,
    setShowModal,
    mode,
    setMode,
  };
};

export default useQuestions;
