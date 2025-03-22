import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

const useStudents = () => {
  const {
    theme,
    toggleTheme,
    navBgColor,
    toggleNavBar,
    cardBgColor,
    btnBgColor,
  } = useTheme();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("ADD");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const initialFormState = {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    userType: "student",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setFormData(
      selectedStudent
        ? {
            ...selectedStudent,
            userType: selectedStudent.userType || "student",
          }
        : initialFormState
    );
  }, [selectedStudent]);

  const fetchStudents = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/getPersons/all");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, []);

  // Open Modal for Add/Edit
  const handleOpenModal = (student = null) => {
    if (student) {
      if (!selectedRow) {
        toast.warning("Please select a row before updating.");
        return;
      }
      if (selectedRow !== student._id) {
        toast.warning("Please click the action button on the selected row.");
        return;
      }
      setMode("EDIT");
      setSelectedStudent(student);
    } else {
      setMode("ADD");
      setSelectedStudent(null);
      setSelectedRow(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!selectedRow) {
      toast.warning("Please select a row before deleting.");
      return;
    }
    if (selectedRow !== id) {
      toast.warning("Please click the action button on the selected row.");
      return;
    }
    const isConfirmed = await Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (isConfirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/deletePerson/${id}`);
        toast.success("Student deleted successfully.");
        fetchStudents();
      } catch (error) {
        toast.error("Failed to delete student.");
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowClick = (id, event) => {
    if (event.target.closest(".action-buttons")) return;
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "ADD") {
        await axios.post("http://localhost:3001/createPerson", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Student added successfully!");
      } else {
        await axios.put(
          `http://localhost:3001/updatePerson/${formData._id}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Student updated successfully!");
      }

      fetchStudents();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to process request."
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData(initialFormState);
  };

  // 🔍 Filter and Sort Students
  const filteredData = students.filter((student) =>
    `${student.firstname} ${student.lastname} ${student.userType}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedData = sortConfig.key
    ? [...filteredData].sort((a, b) =>
        sortConfig.direction === "asc"
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key])
      )
    : filteredData;

  // 📌 Pagination Logic
  const { currentPage, itemsPerPage } = pagination;
  const totalPages =
    itemsPerPage === "All" ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  const displayItems =
    itemsPerPage === "All"
      ? sortedData
      : sortedData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const setCurrentPage = (page) => {
    setPagination((prev) => {
      const newPage = Math.max(1, Math.min(page, totalPages || 1));
      //   console.log("Setting current page to:", newPage); // ✅ Debugging log
      return { ...prev, currentPage: newPage };
    });
  };

  const setItemsPerPage = (value) => {
    const perPage = value === "All" ? "All" : parseInt(value);
    setPagination({ currentPage: 1, itemsPerPage: perPage });
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      //   console.log("Previous Clicked: ", currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      //   console.log("Next Clicked: ", currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    theme,
    students,
    fetchStudents,
    searchTerm,
    setSearchTerm,
    sortConfig,
    handleSort,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    handleDelete,
    handleRowClick,
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    selectedRow,
    totalPages,
    displayItems,
    handlePreviousClick,
    handleNextClick,
    handleOpenModal,
    selectedStudent,
    setSelectedStudent,
    showModal,
    setShowModal,
    mode,
    setMode,
    cardBgColor,
    btnBgColor,
  };
};

export default useStudents;
