import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../store/authContext";

const AdminRoute = ({ children }) => {

  const { userInfo } = useContext(AuthContext);

  // Not logged in
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // Not superadmin
  if (userInfo?.user?.role !== "superadmin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;