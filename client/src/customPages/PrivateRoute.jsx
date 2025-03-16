import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ studentData, allowedRoles }) => {
//   console.log("studentData:", studentData);
//   console.log("allowedRoles:", allowedRoles);
  if (!studentData?.userType) {
    console.log("userType:", studentData?.userType);
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(studentData.userType)) {
    return <Navigate to="/" />; // Redirect unauthorized users
  }

  return <Outlet />;
};

export default PrivateRoute;
