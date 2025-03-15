import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import NavBar from "./NavBar";
import LoginPage from "../pages/LoginPage";
import ContentPage from "../pages/ContentPage";
import HomePage from "../pages/HomePage";
import ExercisesPage from "../pages/ExercisesPage";
import ResultPage from "../pages/ResultPage";
import CongratsPage from "../pages/CongratsPage";
import AccountPage from "../pages/AccountPage";
import QuestionPage from "../pages/QuestionPage";
import LoadingSpinner from "../customPages/LoadingSpinner";

function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  const [studentData, setStudentData] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  // console.log("Layout: ", studentData);

  return (
    <div className={theme}>
      {" "}
      {location.pathname !== "/" && <NavBar studentData={studentData} />}
      <LoadingSpinner />
      <Routes>
        <Route
          path="/"
          element={<LoginPage setStudentData={setStudentData} />}
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/congrats" element={<CongratsPage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/accounts" element={<AccountPage />} />
        <Route path="/contents" element={<ContentPage />} />
        <Route path="/questions" element={<QuestionPage />} />
      </Routes>
    </div>
  );
}

export default Layout;
