import { useState, useEffect } from "react";

import { AuthContext } from "./authContext";

const AuthProvider = ({ children }) => {

  // Load user from localStorage (safe against corrupt/legacy values)
  const [userInfo, setUserInfo] = useState(() => {

    const savedUser =
      localStorage.getItem("userInfo");

    if (!savedUser) return null;

    try {

      const parsed =
        JSON.parse(savedUser);

      if (
        !parsed ||
        typeof parsed !== "object"
      ) {
        return null;
      }

      // Normalize legacy shapes so role checks always work:
      // modern   -> { token, user: { id, name, email, role, store } }
      // legacy   -> { token, name, email, role } (flat) or { user } only
      const user =
        parsed.user &&
        typeof parsed.user === "object"
          ? parsed.user
          : parsed;

      // Pre-rename sessions used role "admin" -> now "superadmin"
      if (user.role === "admin") {
        user.role = "superadmin";
      }

      return {
        token: parsed.token || user.token,
        user,
      };

    } catch {

      localStorage.removeItem("userInfo");

      return null;

    }

  });

  // Save user to localStorage
  useEffect(() => {

    localStorage.setItem(
      "userInfo",
      JSON.stringify(userInfo)
    );

  }, [userInfo]);

  // LOGIN FUNCTION
  const login = (data) => {

    setUserInfo(data);

  };

  // LOGOUT FUNCTION
  const logout = () => {

    setUserInfo(null);

    localStorage.removeItem("userInfo");

  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        setUserInfo,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;