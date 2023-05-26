import {
    Avatar, Backdrop,
    Box,
    Button,
    Checkbox, ClickAwayListener,
    CssBaseline,
    FormControlLabel,
    Grid, Link, Paper, TextField,
    Typography
} from "@mui/material";
import {Lock as LockIcon} from "@mui/icons-material";
import React from "react";
import {isLoggedIn, login} from "../services/UserService";
import {useNavigate} from "react-router-dom";

export const SignIn = (params : {open : boolean, setOpenLogin: Function}) => {

    const navigate = useNavigate();

    const [hasErrors, setHasErrors] = React.useState(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLoggedIn()) {
            return;
        }
        const data = new FormData(event.currentTarget);
        const response = await login(data.get('email'), data.get('password'))

        if (response !== 200) {
            params.setOpenLogin(true);
            setHasErrors(true);
        } else {
            navigate(0);
        }
    };

    const handleClose = () => {
        params.setOpenLogin(false);
        setHasErrors(false);
    }

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={params.open}
        >
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                />
                {
                    params.open ? (<ClickAwayListener onClickAway={handleClose}>
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockIcon/>
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                    <TextField
                                        error={hasErrors}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        helperText={hasErrors ? "Incorrect email or password" : ""}
                                        autoFocus
                                    />
                                    <TextField
                                        error={hasErrors}
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        helperText={hasErrors ? "Incorrect email or password" : ""}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container>
                                        <Grid item>
                                            <Button href={`/register`}>
                                                {"Don't have an account? Sign Up"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </ClickAwayListener>) : (<Box/>)
                }
            </Grid>
        </Backdrop>

    );
}