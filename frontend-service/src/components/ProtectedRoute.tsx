// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
