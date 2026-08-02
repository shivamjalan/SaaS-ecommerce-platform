import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../store/authContext";

const MerchantRoute = ({ children }) => {

  const { userInfo } = useContext(AuthContext);

  // Not logged in
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // Merchant or superadmin only
  const role = userInfo?.user?.role;

  if (role !== "merchant" && role !== "superadmin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default MerchantRoute;
