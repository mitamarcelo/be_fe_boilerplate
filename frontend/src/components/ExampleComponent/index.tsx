import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import styles from "@src/components/ExampleComponent/index.styles";

export default function ExampleComponent() {
    return (
        <Box sx={styles.container}>
            <Typography variant="h3">Example Component</Typography>
        </Box>
    )
}