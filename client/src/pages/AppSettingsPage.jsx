import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../customPages/Header";
import { useTheme } from "../customPages/ThemeContext";
import DarkModeTheme from "../appsettings/DarkModeTheme";
import NavBarColor from "../appsettings/NavBarColor";
import TimeDuration from "../appsettings/TimeDuration";
import Category from "../appsettings/Category";

const AppSettingsPage = () => {
  const {
    theme,
    toggleTheme,
    navBgColor,
    toggleNavBar,
    cardBgColor,
    btnBgColor,
  } = useTheme();
  const [timeDuration, setTimeDuration] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    const duration = Number(timeDuration);

    if (!duration || isNaN(duration) || duration <= 0) {
      alert("Please enter a valid time duration.");
      return;
    }

    const formData = { timeDuration: duration, category };

    try {
      await axios.post("http://localhost:3001/saveAppSettings", formData, {
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

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="App Settings" />

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`card card-${theme} shadow-lg rounded-lg`}>
            {/* Card Header */}
            <div
              className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
            >
              <h2 className="card-title font-weight-bold m-0">
                ⚙️ App Settings
              </h2>
            </div>

            {/* Card Body */}
            <div
              className={`card-body ${
                theme === "dark" ? "dark-mode text-white" : ""
              }`}
            >
              <div className="d-flex justify-content-center">
                {/* Left Column - Sliders */}
                <div className="col-md-6 d-flex flex-column">
                  <DarkModeTheme theme={theme} toggleTheme={toggleTheme} />
                </div>
                {/* Right Column - Inputs */}
                <div className="col-md-6 d-flex flex-column">
                  <TimeDuration
                    timeDuration={timeDuration}
                    setTimeDuration={setTimeDuration}
                  />
                  <NavBarColor
                    navBgColor={navBgColor}
                    toggleNavBar={toggleNavBar}
                  />
                  <Category category={category} setCategory={setCategory} />
                </div>
              </div>

              {/* Save Button */}
              <div class="d-flex justify-content-end mt-3">
                <button className={`btn ${btnBgColor}`} onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsPage;
