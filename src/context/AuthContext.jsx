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
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const logout = async () => {
    await signOut();
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  useEffect(() => {
    const syncUser = async (retryCount = 0) => {
      if (!isClerkLoaded) return;

      // Prevent duplicate sync requests
      if (isSyncing) return;

      if (isSignedIn && clerkUser) {
        setIsSyncing(true);
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
          setError(null);
        } catch (error) {
          console.error("Sync failed:", error);

          // Handle 429 rate limit errors with exponential backoff
          if (error.response?.status === 429 && retryCount < 3) {
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            setError(
              `Too many requests. Retrying in ${delay / 1000} seconds...`
            );
            setTimeout(() => {
              setIsSyncing(false);
              syncUser(retryCount + 1);
            }, delay);
            return;
          }

          // Handle other errors
          if (error.response?.status === 429) {
            setError(
              "Service temporarily unavailable. Please try again in a few minutes."
            );
          } else if (error.message === "Not authorized as admin") {
            await logout();
            setError("Access Denied: You are not an admin.");
          } else if (!error.response) {
            setError(
              "Unable to connect to server. Please check your internet connection."
            );
          } else {
            setError("Authentication failed. Please try again.");
          }

          setUser(null);
        } finally {
          setIsSyncing(false);
        }
      } else {
        // Not signed in
        localStorage.removeItem("adminToken");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setError(null);
      }
      setLoading(false);
    };

    syncUser();
  }, [isClerkLoaded, isSignedIn, clerkUser]);

  return (
    <AuthContext.Provider
      value={{ user, logout, loading: loading || !isClerkLoaded, error }}
    >
      {!loading && (
        <>
          {error && (
            <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg max-w-md z-50">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {children}
        </>
      )}
    </AuthContext.Provider>
  );
};
