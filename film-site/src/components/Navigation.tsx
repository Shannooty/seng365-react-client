import React, {ChangeEvent} from "react";
import {AppBar, Avatar, Box, Button, Container, IconButton, InputBase, Paper, Toolbar, Typography} from "@mui/material";
import {Search} from "@mui/icons-material";
import {SearchContext} from "../contexts/search-context";
import {Link as RouterLink} from "react-router-dom";
import {isLoggedIn, logout} from "../services/UserService";
import {deepOrange} from "@mui/material/colors";
import apiClient from "../defaults/axios-config";



const Navbar = (params: {setOpenLogin: Function}) => {

    const {searchTerm, setSearchTerm} = React.useContext(SearchContext)
    const updateSearchTerm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleLoginButton = () => {
        params.setOpenLogin(true);
    }
    const handleLogoutButton = async () => {
        await logout();
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box></Box>
                    <Paper sx={{borderRadius: "30px",  width: '50%', display:'flex', alignItems: 'center'}}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={searchTerm === '' ? "Search Films" : searchTerm}
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
                                <Box display={'inline-flex'}>
                                    <Avatar
                                        src={apiClient.defaults.baseURL + "/users/" + localStorage.getItem("userId") + "/image"}
                                        sx={{ bgcolor: deepOrange[500], width: "60px", height: "60px" }}
                                    />
                                    <Button href='/' variant="contained" onClick={handleLogoutButton}>Logout</Button>
                                </Box>
                            )
                            :
                            (<Button id="login" variant="contained" onClick={handleLoginButton}>Login</Button>)}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default Navbar;
