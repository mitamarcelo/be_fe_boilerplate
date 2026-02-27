import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "@src/hooks/useAuth";
import AuthForm from "@src/components/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      linkLabel="Create an account"
      linkTo="/register"
      mutation={loginMutation}
      onSuccess={() => navigate("/", { replace: true })}
    />
  );
}
