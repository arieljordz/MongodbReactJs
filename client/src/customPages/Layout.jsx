import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useTheme } from "./ThemeContext";
import NavBar from "./NavBar";
import LoginPage from "../pages/LoginPage";
import ContentPage from "../pages/ContentPage";
import HomePage from "../pages/HomePage";
import ExercisesPage from "../pages/ExercisesPage";
import ResultPage from "../pages/ResultPage";
import AllResultPage from "../pages/AllResultPage";
import AccountPage from "../pages/AccountPage";
import QuestionPage from "../pages/QuestionPage";
import AppSettingsPage from "../pages/AppSettingsPage";
import LoadingSpinner from "../customPages/LoadingSpinner";
import PrivateRoute from "./PrivateRoute";
import PreventBackNavigation from "../customPages/PreventBackNavigation";

// Define page access flow
const studentFlow = [
  "/student/home",
  "/student/exercises",
  "/student/results",
];
const teacherFlow = [
  "/admin/results",
  "/admin/contents",
  "/admin/questions",
  "/admin/accounts",
  "/admin/appsettings",
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [studentData, setStudentData] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const getAllowedFlow = (userType) => {
    return userType === "student" ? studentFlow : teacherFlow;
  };

  const [allowedPath, setAllowedPath] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedPath = localStorage.getItem("allowedPath");
    return (
      savedPath || (user?.userType ? getAllowedFlow(user.userType)[0] : "/")
    );
  });

  useEffect(() => {
    if (studentData?.userType) {
      const flow = getAllowedFlow(studentData.userType);
      const savedPath = localStorage.getItem("allowedPath");
      // const progress = localStorage.getItem("progress");
  
      // console.log("studentData: ", studentData);
      // console.log("progress: ", progress);
      // console.log("savedPath: ", savedPath);

      if (!savedPath || flow.indexOf(savedPath) === -1) {
        console.log("Resetting allowedPath to first step", flow[0]);
        setAllowedPath(flow[0]);
        localStorage.setItem("allowedPath", flow[0]);
      }
    }
  }, [studentData]);

  useEffect(() => {
    if (studentData?.userType) {
      const flow = getAllowedFlow(studentData.userType);
      const currentIndex = flow.indexOf(location.pathname);
      const allowedIndex = flow.indexOf(allowedPath);

      // Allow teachers to navigate freely within their allowed routes
      if (studentData.userType === "teacher") {
        if (!flow.includes(location.pathname)) {
          navigate(allowedPath, { replace: true });
        }
        return;
      }

      // For students, enforce the step-by-step navigation
      if (
        currentIndex > allowedIndex ||
        currentIndex < allowedIndex ||
        currentIndex === -1
      ) {
        navigate(allowedPath, { replace: true });
      } else {
        setAllowedPath(flow[currentIndex]);
        localStorage.setItem("allowedPath", flow[currentIndex]);
      }
    }
  }, [location.pathname, studentData, allowedPath, navigate]);

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      if (!user?.userType) {
        localStorage.removeItem("user");
        console.log("User is not authenticated. Redirecting...");
        navigate("/");
      }
      setStudentData(user);
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate]);

  const moveToNextStep = () => {
    if (!studentData?.userType) return;

    const flow = getAllowedFlow(studentData.userType);
    const currentIndex = flow.indexOf(allowedPath);

    // console.log("Current allowed path index:", currentIndex);

    if (currentIndex < flow.length - 1) {
      setAllowedPath(flow[currentIndex + 1]);
      localStorage.setItem("allowedPath", flow[currentIndex + 1]);
    }
  };

  // console.log("Final allowedPath:", allowedPath);

  return (
    <div className={theme}>
      <PreventBackNavigation />
      {location.pathname !== "/" && studentData?.userType && (
        <NavBar
          studentData={studentData}
          moveToNextStep={moveToNextStep}
          allowedPath={allowedPath}
        />
      )}
      <LoadingSpinner />
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={<LoginPage setStudentData={setStudentData} />}
        />

        {/* Protected Routes for Students */}
        <Route
          element={
            <PrivateRoute
              studentData={studentData}
              allowedRoles={["student"]}
            />
          }
        >
          <Route
            path="/student/home"
            element={
              <HomePage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
          <Route
            path="/student/exercises"
            element={
              <ExercisesPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
          <Route
            path="/student/results"
            element={
              <ResultPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
        </Route>

        {/* Protected Routes for Teachers */}
        <Route
          element={
            <PrivateRoute
              studentData={studentData}
              allowedRoles={["teacher"]}
            />
          }
        >
          <Route
            path="/admin/results"
            element={
              <AllResultPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
          <Route
            path="/admin/contents"
            element={
              <ContentPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
          <Route
            path="/admin/questions"
            element={
              <QuestionPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
          <Route
            path="/admin/accounts"
            element={
              <AccountPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
          <Route
            path="/admin/appsettings"
            element={
              <AppSettingsPage
                moveToNextStep={moveToNextStep}
                allowedPath={allowedPath}
              />
            }
          />
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default Layout;
