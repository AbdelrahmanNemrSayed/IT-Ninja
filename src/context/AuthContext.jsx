import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }

        if (event === "PASSWORD_RECOVERY") {
          setRecoveryMode(true);
          setAuthModal(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        // Profile doesn't exist yet, create it
        await createProfile(userId);
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId) => {
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email || "";
    const metaUsername = userData?.user?.user_metadata?.username;
    const username = metaUsername || email.split("@")[0] || "Ninja";

    const { data } = await supabase
      .from("profiles")
      .insert([{ id: userId, username, total_xp: 0, rank: "Ninja Rookie" }])
      .select()
      .single();

    setProfile(data);
  };

  const updateProfile = async (updates) => {
    if (!user || !isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  };

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: username || email.split("@")[0]
        }
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const addXP = async (amount) => {
    if (!user || !profile || !isSupabaseConfigured) return;
    const newXP = (profile.total_xp || 0) + amount;
    const rank =
      newXP >= 500 ? "Platinum Ninja" :
      newXP >= 300 ? "Gold Ninja" :
      newXP >= 150 ? "Silver Ninja" :
      newXP > 0    ? "Bronze Ninja" : "Ninja Rookie";
    await updateProfile({ total_xp: newXP, rank });
  };

  return (
    <AuthContext.Provider
      value={{
        user, profile, loading,
        authModal, setAuthModal,
        recoveryMode, setRecoveryMode,
        signUp, signIn, signOut,
        updateProfile, addXP,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
