import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../customPages/Header";
import { useTheme } from "../customPages/ThemeContext";
import AppSettignsTab from "../appsettings/AppSettignsTab";

const AppSettingsPage = () => {
  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const {
    theme,
    toggleTheme,
    navBgColor,
    toggleNavBar,
    cardBgColor,
    btnBgColor,
  } = useTheme();

  const [timeDuration, setTimeDuration] = useState("");
  const [appName, setAppName] = useState("");
  const [navColor, setNavColor] = useState("");
  const [settings, setSettings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [fmCategory, setFMCategory] = useState("");

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAppSettings`);
      setSettings(response.data);
      setAppName(response.data.appName || "");
      setTimeDuration(response.data.timeDuration || "");
    } catch (error) {
      console.error("Error fetching Settings:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/getCategories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching Settings:", error);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const duration = Number(timeDuration);

    if (!duration || isNaN(duration) || duration <= 0) {
      toast.warning("Please enter a valid time duration.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      return;
    }

    const formData = { timeDuration: duration, appName: appName, navColor: navColor };

    try {
      await axios.post(`${API_URL}/saveAppSettings`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("App Settings saved!", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to process request.");
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    if (!fmCategory?.trim()) {
      toast.warning("Category description cannot be empty!", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      return;
    }

    const formData = { description: fmCategory, isActive: false };
    try {
      await axios.post(`${API_URL}/saveCategory`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Category saved!", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.warning(error.response?.data?.message, {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    }
  };

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="App Settings" />

      <div
        className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
      >
        {/* Card Header */}
        <div
          className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
        >
          <h2 className="card-title font-weight-bold m-0">⚙️ App Settings</h2>
        </div>

        {/* Card Body */}
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <AppSettignsTab
            settings={settings}
            categories={categories}
            theme={theme}
            cardBgColor={cardBgColor}
            toggleTheme={toggleTheme}
            appName={appName}
            setAppName={setAppName}
            timeDuration={timeDuration}
            setTimeDuration={setTimeDuration}
            navBgColor={navBgColor}
            toggleNavBar={toggleNavBar}
            category={category}
            setCategory={setCategory}
            btnBgColor={btnBgColor}
            onSaveSettings={handleSaveSettings}
            onSaveCategory={handleSaveCategory}
            fmCategory={fmCategory}
            setFMCategory={setFMCategory}
            navColor={navColor}
            setNavColor={setNavColor}
          />
        </div>
      </div>
    </div>
  );
};

export default AppSettingsPage;
