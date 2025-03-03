import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext"; 
import NavBar from "./NavBar";
import Login from "../pages/Login";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";

function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  return (
    <div className={theme}>
      {" "}
      {/* Apply theme class */}
      {/* Show Navbar only if NOT on the Login page */}
      {location.pathname !== "/" && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default Layout;
