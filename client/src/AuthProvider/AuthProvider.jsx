import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user from localStorage on app load
useEffect(() => {
  const storedUser = localStorage.getItem("user");
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

  console.log('user',user)

  const authInfo = {
    loading,
    user,
    setUser, // optional, if you want to update user from components
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
