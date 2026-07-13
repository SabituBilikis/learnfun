import { useState } from "react";
import { useNavigate } from "react-router";
import { ParentGate } from "@/features/parent/ParentGate";
import { ParentDashboard } from "@/features/parent/ParentDashboard";

export function ParentRoute() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <ParentGate onSuccess={() => setAuthenticated(true)} onBack={() => navigate("/")} />;
  }

  return <ParentDashboard onBack={() => navigate("/")} />;
}
