import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import AppHeader from "@src/components/AppHeader";
import { AuthInitializer } from "@src/components/initializers/AuthInitializer";

import styles from "@src/components/AppLayout/index.styles";

export default function AppLayout() {
  return (
    <Box>
      <AuthInitializer />
      <AppHeader />
      <Box component="main" sx={styles.main}>
        <Outlet />
      </Box>
    </Box>
  );
}
