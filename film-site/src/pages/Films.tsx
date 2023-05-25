import React, {ChangeEvent} from "react";
import apiClient from "../defaults/axios-config";

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Grid, InputLabel, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Stack,
    Typography
} from "@mui/material";
import {FilmQueryList, FilmSimpleList} from "../components/FilmComponents";
import {Filters} from "../components/Filters";


const Films = () => {

    const [query, setQuery] = React.useState('');

    return (

        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <FilmQueryList query={query}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Filters setQuery={setQuery}/>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Films;