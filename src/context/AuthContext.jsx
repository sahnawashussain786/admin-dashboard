import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser, useClerk } from "@clerk/clerk-react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = "http://localhost:5000/api";

  const logout = async () => {
    await signOut();
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  useEffect(() => {
    const syncUser = async () => {
      if (!isClerkLoaded) return;

      if (isSignedIn && clerkUser) {
        try {
          const { data } = await axios.post("/auth/sync", {
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
          });

          if (!data.isAdmin) {
            throw new Error("Not authorized as admin");
          }

          localStorage.setItem("adminToken", data.token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.token}`;
          setUser(data);
        } catch (error) {
          console.error("Sync failed:", error);
          await logout();
          alert("Access Denied: You are not an admin.");
        }
      } else {
        // Not signed in
        localStorage.removeItem("adminToken");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
      setLoading(false);
    };

    syncUser();
  }, [isClerkLoaded, isSignedIn, clerkUser]);

  return (
    <AuthContext.Provider
      value={{ user, logout, loading: loading || !isClerkLoaded }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
