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
        primary: {
            main: '#16181c',
        },
        secondary: {
            main: '#2e323b',
        },
        error: {
            main: '#bd4444',
        },
        success: {
            main: '#5ada65',
        },
        bgPrimary: palette.augmentColor({
            color: {
                main: "#ededed"
            }
        })

    },
});