import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import NavBar from "./NavBar";
import LoginPage from "../pages/LoginPage";
import ContentPage from "../pages/ContentPage";
import ExercisesPage from "../pages/ExercisesPage";
import ResultPage from "../pages/ResultPage";
import AccountPage from "../pages/AccountPage";
import QuestionPage from "../pages/QuestionPage";
import LoadingSpinner from "../customPages/LoadingSpinner";

function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  const [studentData, setStudentData] = useState(null);
  console.log("Layout: ", studentData);

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
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/question" element={<QuestionPage />} />
      </Routes>
    </div>
  );
}

export default Layout;
