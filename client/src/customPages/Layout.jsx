import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext"; 
import NavBar from "./NavBar";
import Login from "../pages/Login";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Question from "../pages/Question";

function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  return (
    <div className={theme}>
      {" "}
      {location.pathname !== "/" && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/question" element={<Question />} />
      </Routes>
    </div>
  );
}

export default Layout;
