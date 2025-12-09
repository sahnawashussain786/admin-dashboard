import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import PaymentsPage from "./pages/Payments";
import MessagesPage from "./pages/Messages";
import SubscribersPage from "./pages/Subscribers";
import Layout from "./components/Layout";

// Access the key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/login" />;

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <>
            <SignedOut>
              <Login />
            </SignedOut>
            <SignedIn>
              <Navigate to="/" />
            </SignedIn>
          </>
        }
      />

      <Route
        element={
          <SignedIn>
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          </SignedIn>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ClerkProvider>
  );
}

export default App;
