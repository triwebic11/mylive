import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userPackage, setUserPackage] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // console.log("stoooooooooooooooooore--", storedUser)
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem("user"); // cleanup if bad value
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("userPackage");
    if (storedData) {
      setUserPackage(JSON.parse(storedData));
    }
  }, []);

  // console.log("user localStorage -------------------", user);

  const authInfo = {
    loading,
    user,
    setUser,
    userPackage,
    setUserPackage, // optional, if you want to update user from components
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
