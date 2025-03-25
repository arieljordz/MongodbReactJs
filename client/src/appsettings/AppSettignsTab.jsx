import { useState } from "react";
import DarkModeTheme from "./DarkModeTheme";
import NavBarColor from "./NavBarColor";
import TimeDuration from "./TimeDuration";
import Category from "./Category";
import FMCategory from "./FMCategory";
import AppName from "./AppName";

function AppSettignsTab({
  settings,
  categories,
  theme,
  cardBgColor,
  toggleTheme,
  appName,
  setAppName,
  timeDuration,
  setTimeDuration,
  navBgColor,
  toggleNavBar,
  category,
  setCategory,
  btnBgColor,
  onSaveSettings,
  fmCategory,
  setFMCategory,
  onSaveCategory,
  navColor,
  setNavColor,
}) {
  const [activeTab, setActiveTab] = useState("appSettings");

  return (
    <div className="container">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "appSettings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appSettings")}
          >
            App Settings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "fileMaintenance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("fileMaintenance")}
          >
            File Maintenance
          </button>
        </li>
      </ul>
      <div className="tab-content p-3 border border-top-0">
        {activeTab === "appSettings" && (
          <AppSettings
            settings={settings}
            categories={categories}
            theme={theme}
            toggleTheme={toggleTheme}
            appName={appName}
            setAppName={setAppName}
            timeDuration={timeDuration}
            setTimeDuration={setTimeDuration}
            navBgColor={navBgColor}
            toggleNavBar={toggleNavBar}
            btnBgColor={btnBgColor}
            onSaveSettings={onSaveSettings}
            category={category}
            setCategory={setCategory}
            navColor={navColor}
            setNavColor={setNavColor}
          />
        )}
        {activeTab === "fileMaintenance" && (
          <FileMaintenance
            fmCategory={fmCategory}
            setFMCategory={setFMCategory}
            btnBgColor={btnBgColor}
            onSaveCategory={onSaveCategory}
          />
        )}
      </div>
    </div>
  );
}

function AppSettings({
  settings,
  categories,
  theme,
  toggleTheme,
  appName,
  setAppName,
  timeDuration,
  setTimeDuration,
  navBgColor,
  toggleNavBar,
  btnBgColor,
  onSaveSettings,
  category,
  setCategory,
  navColor,
  setNavColor,
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <AppName
            settings={settings}
            appName={appName}
            setAppName={setAppName}
          />
          <TimeDuration
            settings={settings}
            timeDuration={timeDuration}
            setTimeDuration={setTimeDuration}
          />
          <Category
            categories={categories}
            category={category}
            setCategory={setCategory}
          />
          <NavBarColor
            navBgColor={navBgColor}
            toggleNavBar={toggleNavBar}
            navColor={navColor}
            setNavColor={setNavColor}
          />
        </div>
        <div className="col-md-3">
          <DarkModeTheme theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
      <div className="row">
        {/* Save Button */}
        <div className="d-flex justify-content-end mt-3">
          <button className={`btn ${btnBgColor}`} onClick={onSaveSettings}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function FileMaintenance({
  fmCategory,
  setFMCategory,
  btnBgColor,
  onSaveCategory,
}) {
  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <FMCategory fmCategory={fmCategory} setFMCategory={setFMCategory} />
        </div>
      </div>
      <div className="row">
        {/* Save Button */}
        <div className="d-flex justify-content-end mt-3">
          <button className={`btn ${btnBgColor}`} onClick={onSaveCategory}>
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}
export default AppSettignsTab;
