import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext"; 
import NavBar from "./NavBar";
import LoginPage from "../pages/LoginPage";
import ContentPage from "../pages/ContentPage";
import ExercisesPage from "../pages/ExercisesPage";
import ResultPage from "../pages/ResultPage";
import QuestionPage from "../pages/QuestionPage";
import LoadingSpinner from "../customPages/LoadingSpinner";

function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  return (
    <div className={theme}>
      {" "}
      {location.pathname !== "/" && <NavBar />}
      <LoadingSpinner />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/question" element={<QuestionPage />} />
      </Routes>
    </div>
  );
}

export default Layout;
