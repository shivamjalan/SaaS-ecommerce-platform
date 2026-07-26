import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../store/AuthContext";

const AdminRoute = ({ children }) => {

  const { userInfo } = useContext(AuthContext);

  // Not logged in
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // Not admin
  if (userInfo?.user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;