import {FilmQueryList} from "../components/FilmComponents";
import React from "react";
import {Container, Grid, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {isLoggedIn} from "../services/UserService";

export const MyFilms = () => {

    const navigate = useNavigate();

    if (!isLoggedIn()) {
        navigate('/');
    }

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={'h3'}>My Films</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FilmQueryList query={`directorId=${localStorage.getItem('userId')}&`}/>
                </Grid>
            </Grid>
        </Container>
    )
}