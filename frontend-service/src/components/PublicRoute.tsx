// src/components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  if (isAuthenticated()) {
    return <Navigate to="/todo" replace />;
  }
  return children;
}
