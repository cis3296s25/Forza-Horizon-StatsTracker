import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in local storage or cookies
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (jwt) => {
    try {
      const response = await axios.get("/api/userStats/api", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error("User fetch failed", err);
      logout();
    }
  };

  const login = (jwt, userData) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt);
    setUser(userData);
    navigate("/user/:username");
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
