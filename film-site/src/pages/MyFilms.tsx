import {FilmQueryList} from "../components/FilmComponents";
import React from "react";
import {Container, Grid, Typography} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getUserId, isLoggedIn} from "../services/UserService";

export const MyFilms = () => {

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/');
        }
    }, [])


    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={'h3'}>My Films</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FilmQueryList query={`directorId=${getUserId()}&`}/>
                </Grid>
            </Grid>
        </Container>
    )
}