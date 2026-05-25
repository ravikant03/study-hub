"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearToken, setToken } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/auth/me")
      .then((payload) => setUser(payload.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (values) => {
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: values
    });
    setToken(payload.token);
    setUser(payload.data);
    return payload.data;
  };

  const register = async (values) => {
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") body.append(key, value);
    });

    const payload = await apiRequest("/auth/register", {
      method: "POST",
      body
    });
    return payload.data;
  };

  const verifyOtp = async (values) => {
    const payload = await apiRequest("/auth/verify-otp", {
      method: "POST",
      body: values
    });
    setToken(payload.token);
    setUser(payload.data);
    return payload.data;
  };

  const refreshUser = async () => {
    const payload = await apiRequest("/auth/me");
    setUser(payload.data);
    return payload.data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      verifyOtp,
      refreshUser,
      logout,
      isAdmin: user?.role === "admin",
      isInstructor: user?.role === "instructor"
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
