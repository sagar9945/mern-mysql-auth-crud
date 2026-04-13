import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}