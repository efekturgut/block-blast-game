import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoadingAuth(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      const data = await registerUser({
        username,
        email,
        password,
      });

      return {
        success: true,
        message: data.message || "Kayıt başarılı.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Kayıt başarısız.",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      return {
        success: true,
        message: data.message || "Giriş başarılı.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Giriş başarısız.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingAuth,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};