import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user session exists
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      }
      if (session?.user) setUser(session.user);
      setLoading(false);
    };

    getSession();

    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (!data.user) throw new Error("Login failed. Email might not be confirmed yet.");

    setUser(data.user);
    return data.user;
  };

  // Signup with email/password
  const signup = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) throw error;

    // If data.user exists but session is null, email confirmation is required
    const needsConfirmation = data.user && !data.session;

    // Only set user if email does not require confirmation (session exists)
    if (data.session?.user) {
      setUser(data.session.user);
    }

    return { user: data.user, needsConfirmation };
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
