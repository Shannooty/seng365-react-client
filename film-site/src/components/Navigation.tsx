import React, {ChangeEvent} from "react";
import {AppBar, Avatar, Box, Button, Container, IconButton, InputBase, Paper, Toolbar, Typography} from "@mui/material";
import {Search} from "@mui/icons-material";
import {SearchContext} from "../contexts/search-context";
import {Link as RouterLink} from "react-router-dom";
import {isLoggedIn} from "../services/UserService";
import {deepOrange} from "@mui/material/colors";



const Navbar = (params: {setOpenLogin: Function}) => {

    const {searchTerm, setSearchTerm} = React.useContext(SearchContext)
    const updateSearchTerm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleLoginButton = () => {
        params.setOpenLogin(true);
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
                        {isLoggedIn() ? (<Avatar sx={{ bgcolor: deepOrange[500], width: "60px", height: "60px" }}/>)
                            : (<Button variant="contained" onClick={handleLoginButton}>Login</Button>)}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default Navbar;
