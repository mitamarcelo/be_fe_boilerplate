import { useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { useLogoutMutation } from "@src/hooks/useAuth";
import { type RootState } from "@src/store";

import styles from "@src/components/AppHeader/index.styles";

export default function AppHeader() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const email = useSelector((state: RootState) => state.auth.email);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const isAuthenticated = Boolean(email);

  const handleLogout = async () => {
    setLogoutError(null);

    try {
      await logoutMutation.mutateAsync();
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log out.";
      setLogoutError(message);
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      color="transparent"
      sx={styles.appBar}
    >
      <Toolbar sx={styles.toolbar}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          color="inherit"
          sx={styles.toolbarTitle}
        >
          Boilerplate
        </Typography>
        <Box sx={styles.toolbarButtons}>
          {logoutError ? (
            <Typography color="error" variant="body2" role="alert">
              {logoutError}
            </Typography>
          ) : null}
          {isAuthenticated ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login">
                Log in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
