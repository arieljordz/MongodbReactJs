import React, { useState, useEffect } from "react";
import ContentTable from "../customPages/ContentTable";
import CreateContentModal from "../modals/CreateContentModal";
import axios from "axios";
import { Modal } from "bootstrap";

function Home() {
  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to Fetch Contents
  const fetchContents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getContents/all");
      setContents(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  // Fetch contents on page load
  useEffect(() => {
    fetchContents();
    const modalElement = document.getElementById("modalContent");
    if (modalElement) {
      new Modal(modalElement);
    }
  }, []);

  return (
    <div className="container mt-3">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalContent"
        onClick={() => setShowModal(true)}
      >
        Add New
      </button>

      <CreateContentModal
        fetchContents={fetchContents}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
      />
      <ContentTable data={contents} setEditingContent={setEditingContent} fetchContents={fetchContents} />
    </div>
  );
}

export default Home;
