import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  // Load user from localStorage
  const [userInfo, setUserInfo] = useState(() => {

    const savedUser = localStorage.getItem("userInfo");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
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