import {createTheme} from '@mui/material/styles';
import {PaletteColorOptions} from "@mui/material";

declare module '@mui/material/styles' {
    export interface Palette {
        bgPrimary: PaletteColorOptions;
    }
    export interface PaletteOptions {
        bgPrimary: PaletteColorOptions;
    }
}

const { palette } = createTheme();
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: "#0581a1"
        },
        secondary: {
            main: "#a8a8a8"
        },

        bgPrimary: palette.augmentColor({
            color: {
                main: "#1a1a1a"
            }
        })

    },
});