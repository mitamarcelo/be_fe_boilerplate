import { useNavigate } from "react-router-dom";

import { useRegisterMutation } from "@src/hooks/useAuth";
import AuthForm from "@src/components/AuthForm";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  return (
    <AuthForm
      title="Create account"
      submitLabel="Register"
      linkLabel="Already have an account? Log in"
      linkTo="/login"
      mutation={registerMutation}
      onSuccess={() => navigate("/login", { replace: true })}
    />
  );
}
