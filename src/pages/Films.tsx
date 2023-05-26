import React from "react";

import {Box, Container, Grid, Typography} from "@mui/material";
import {FilmQueryList} from "../components/FilmComponents";
import {Filters} from "../components/Filters";


const Films = () => {

    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        document.title = `Search Films`;
    }, []);

    return (

        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={'h3'}>Films</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FilmQueryList query={query}/>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Box sx={{py: 8}}>
                        <Filters setQuery={setQuery}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Films;