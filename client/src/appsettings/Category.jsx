import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3001";

const Category = ({ categories, category, setCategory }) => {
  const [activeCategory, setActiveCategory] = useState("");

  // Set the active category on component mount or when categories change
  useEffect(() => {
    const activeCat = categories.find((cat) => cat.isActive);
    if (activeCat) {
      setCategory(activeCat.description);
      setActiveCategory(activeCat.description);
    }
  }, [categories, setCategory]);

  const handleChange = async (e) => {
    const selectedCategory = e.target.value;

    // Prevent unnecessary updates if the selected category is already active
    if (selectedCategory === activeCategory) return;

    setCategory(selectedCategory);
    setActiveCategory(selectedCategory);

    try {
      await axios.put(
        `${API_BASE_URL}/updateActiveCategory/${selectedCategory}`,
        { description: selectedCategory, isActive: true },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(`${selectedCategory} is now an active category`, {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    } catch (error) {
      console.error("Error updating category:", error);

      toast.warning(
        error.response?.data?.message || "Failed to update category!",
        {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        }
      );
    }
  };

  return (
    <div className="mb-2 text-left">
      <label className="form-label d-block text-start">
        Category (active):
      </label>
      <select className="form-select" value={category} onChange={handleChange}>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.description}>
            {cat.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Category;
