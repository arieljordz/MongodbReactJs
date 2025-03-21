import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

const useContents = () => {
  const {
    theme,
    toggleTheme,
    navBgColor,
    toggleNavBar,
    cardBgColor,
    btnBgColor,
  } = useTheme();
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("ADD");
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const initialFormState = {
    title: "",
    description: "",
    link: "",
    category: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    if (selectedContent) {
      setFormData(selectedContent);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedContent]);

  const fetchContents = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/getContents/all");
      setContents(data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  }, []);

  // Open Modal for Add/Edit
  const handleOpenModal = (content = null) => {
    if (content) {
      if (!selectedRow) {
        toast.warning("Please select a row before updating.");
        return;
      }
      if (selectedRow !== content._id) {
        toast.warning("Please click the action button on the selected row.");
        return;
      }
      setMode("EDIT");
      setSelectedContent(content);
    } else {
      setMode("ADD");
      setSelectedContent(null);
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
      text: "Are you sure you want to delete this content?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (isConfirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/deleteContent/${id}`);
        toast.success("content deleted successfully.");
        fetchContents();
      } catch (error) {
        toast.error("Failed to delete content.");
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "ADD") {
        console.log("Add payload:", formData);
        await axios.post("http://localhost:3001/createContent", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Content added successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        console.log("Update payload:", formData);
        await axios.put(
          `http://localhost:3001/updateContent/${formData._id}`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Content updated successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
        setShowModal(false);
      }

      fetchContents();
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to process request.");
    }
    setSelectedRow(null);
    setSelectedContent(null);
    setActiveDropdown(null);
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setShowModal(false);
    setSelectedRow(null);
    setSelectedContent(null);
  };

  // 🔍 Filter and Sort contents
  const filteredData = contents.filter((content) =>
    `${content.title} ${content.category}`
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
    contents,
    fetchContents,
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
    selectedContent,
    setSelectedContent,
    showModal,
    setShowModal,
    mode,
    setMode,
    cardBgColor,
    btnBgColor,
  };
};

export default useContents;
