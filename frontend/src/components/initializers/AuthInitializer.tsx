import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthBootstrap } from "@src/hooks/useAuth";

export function AuthInitializer() {
  const navigate = useNavigate();
  const validation = useAuthBootstrap();

  useEffect(() => {
    if (validation.isError) {
      navigate("/login", { replace: true });
    }
  }, [navigate, validation.isError]);

  return null;
}