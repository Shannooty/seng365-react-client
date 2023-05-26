import React, {ChangeEvent} from "react";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    InputBase,
    Paper,
    Toolbar,
    Typography
} from "@mui/material";
import {Search, VideoCall} from "@mui/icons-material";
import {SearchContext} from "../contexts/search-context";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {getUserId, isLoggedIn, logout} from "../services/UserService";
import {deepOrange} from "@mui/material/colors";
import apiClient from "../defaults/axios-config";
import {FilmForm} from "./Forms";



const Navbar = (params: {setOpenLogin: Function}) => {

    const navigate = useNavigate();
    const {searchTerm, setSearchTerm} = React.useContext(SearchContext)
    const [open, setOpen] = React.useState(false);
    const updateSearchTerm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleLoginButton = () => {
        params.setOpenLogin(true);
    }
    const handleLogoutButton = async () => {
        await logout();
    }

    function handleCreateFilm() {
        setOpen(true);
    }

    function handleAvatar() {
        navigate("/profile")
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    {isLoggedIn() ?
                        <Box display={'inline-flex'} gap={2}>
                            <RouterLink to={"/myfilms"}>
                                <Button variant={'contained'}>
                                    My Films
                                </Button>
                            </RouterLink>
                            <RouterLink to={"/films"}>
                                <Button variant={'contained'}>
                                    All Films
                                </Button>
                            </RouterLink>
                        </Box>
                        :
                        <Box/>
                    }
                    <Paper sx={{borderRadius: "30px",  width: '50%', display:'flex', alignItems: 'center'}}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={searchTerm === '' ? "Search Films" : ""}
                            value={searchTerm}
                            inputProps={{ 'aria-label': 'search films' }}
                            onChange={updateSearchTerm}
                        />
                        <RouterLink to={"/films"}>
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <Search/>
                            </IconButton>
                        </RouterLink>
                    </Paper>
                    <Box>
                        {isLoggedIn() ?
                            (
                                <Grid display={'inline-flex'} gap={2}>
                                    <Button variant="contained" aria-label="new-movie" onClick={handleCreateFilm}>
                                        <VideoCall/>
                                    </Button>
                                    <Button variant="contained" onClick={handleAvatar}>
                                        <Avatar
                                            src={apiClient.defaults.baseURL + "/users/" + getUserId() + "/image"}
                                            sx={{ bgcolor: deepOrange[500], width: "50px", height: "50px" }}
                                        />
                                    </Button>
                                    <Button href='/' variant="contained" onClick={handleLogoutButton}>Logout</Button>
                                </Grid>
                            )
                            :
                            (<Grid display={'inline-flex'}>
                                <Button id="login" variant="contained" onClick={handleLoginButton}>Login</Button>
                            </Grid>
                            )}
                    </Box>
                </Toolbar>
            </Container>
            <FilmForm open={open} setOpen={setOpen} edit={false} filmId={0}/>
        </AppBar>
    )
}
export default Navbar;
