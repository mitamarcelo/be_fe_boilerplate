import type { SxProps, Theme } from "@mui/material/styles";

export default {
    appBar: {
        borderBottom: 1,
        borderColor: "divider",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
    },
    toolbarButtons: {
        display: "flex",
        alignItems: "center",
        gap: 1.5,
    },
    toolbarTitle: {
        textDecoration: "none",
    },
} satisfies SxProps<Theme>;