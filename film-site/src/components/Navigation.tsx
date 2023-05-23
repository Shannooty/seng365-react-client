import React, {ChangeEvent} from "react";
import {AppBar, Box, Container, IconButton, InputBase, Paper, Toolbar} from "@mui/material";
import {Search} from "@mui/icons-material";
import {SearchContext} from "../Contexts/search-context";
import {Link as RouterLink} from "react-router-dom";


const Navbar = () => {

    const {searchTerm, setSearchTerm} = React.useContext(SearchContext)
    const updateSearchTerm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(event.target.value);
    }

    React.useEffect(() => {

    }, [])

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
                    <Box></Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default Navbar;
