import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../store/AuthContext";

const ProtectedRoute = ({ children }) => {

  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;