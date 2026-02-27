import { useState, type SyntheticEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import styles from "@src/components/AuthForm/index.styles";

type AuthFormProps = {
  title: string;
  submitLabel: string;
  linkLabel: string;
  linkTo: string;
  mutation: {
    mutateAsync: (credentials: { email: string; password: string }) => Promise<unknown>;
    isPending?: boolean;
  };
  onSuccess?: () => void | Promise<void>;
};

export default function AuthForm({
  title,
  submitLabel,
  linkLabel,
  linkTo,
  mutation,
  onSuccess,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await mutation.mutateAsync({ email, password });
      await onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Unable to ${title.toLowerCase()}.`;
      setErrorMessage(message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
      <Typography variant="h4">{title}</Typography>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      <TextField
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <Button
        type="submit"
        variant="contained"
        disabled={Boolean(mutation.isPending)}
      >
        {submitLabel}
      </Button>
      <Button component={RouterLink} to={linkTo}>
        {linkLabel}
      </Button>
    </Box>
  );
}
