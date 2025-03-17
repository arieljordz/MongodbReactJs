import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ studentData, allowedRoles, allowedPath }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if user is authenticated
  if (!studentData?.userType) {
    return <Navigate to="/" />;
  }

  // Check if user has the correct role
  if (allowedRoles && !allowedRoles.includes(studentData.userType)) {
    return <Navigate to="/" />;
  }

  // If user is a teacher, check if the current path is in allowedPath
  if (studentData.userType === "teacher" && allowedPath) {
    if (!allowedPath.includes(currentPath)) {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
