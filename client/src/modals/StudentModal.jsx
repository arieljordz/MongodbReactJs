import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

function StudentModal({
  fetchStudents,
  selectedStudent,
  setSelectedStudent,
  showModal,
  setShowModal,
  mode,
  setMode,
  selectedRow,
  setSelectedRow,
  activeDropdown,
  setActiveDropdown,
}) {
  const initialFormState = {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    userType: "student",
  };

  const [formData, setFormData] = useState(initialFormState);
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        ...selectedStudent,
        userType: selectedStudent.userType || "student",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(`Changing ${name} to:`, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "ADD") {
        console.log("Add payload:", formData);
        await axios.post("http://localhost:3001/createPerson", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Student added successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        console.log("Update payload:", formData);
        await axios.put(
          `http://localhost:3001/updatePerson/${formData._id}`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Student updated successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
        setShowModal(false);
      }

      fetchStudents();
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to process request.");
    }
    setSelectedRow(null);
    setSelectedStudent(null);
    setActiveDropdown(null);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setShowModal(false);
    setSelectedRow(null);
    setSelectedStudent(null);
    setActiveDropdown(null);
  };

  // console.log(selectedStudent);
  return (
    <div
      className={`modal fade ${showModal ? "show d-block" : ""} ${theme}`}
      tabIndex={-1}
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "ADD" ? "Add New Student" : "Update Student"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCancel}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="Enter First Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="middlename" className="form-label">
                  Middle Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="middlename"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  placeholder="Enter Middle Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Enter Last Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter Email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="userType"
                  value={formData.userType || "student"}
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {mode === "ADD" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentModal;
