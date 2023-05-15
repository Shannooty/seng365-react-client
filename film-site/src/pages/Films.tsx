import React from "react";
import axios from "axios";
import {theme} from "../theme";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid, Paper, Stack,
    ThemeProvider,
    Typography
} from "@mui/material";


const Films = () => {

    const [films, setFilms] = React.useState < Array < Film >> ([])
    const [genres, setGenres] = React.useState < Array < Genre >> ([])

    React.useEffect(() => {
        const getFilms = async () => {
            await axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films')
                .then((response) => {
                    setFilms(response.data.films)
                })
        }

        const getGenres = async () => {
            await axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films/genres')
                .then((response) => {
                    setGenres(response.data)
                })
        }
        getFilms();
        getGenres();
    }, [])


    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ py: 8 }} maxWidth="md">
                {/* End hero unit */}
                <Stack spacing={4}>
                    {films.map((film : Film) => (
                        <Paper elevation={2}>
                            <Grid container alignItems="center" justifyContent="center">
                                <Grid item xs={2}>
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 'auto',
                                            width: '100%',
                                        }}
                                        src={'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + film.filmId + "/image"}
                                        alt="random"
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant={'h5'}>
                                        {film.title}
                                    </Typography>
                                    <Typography variant={'subtitle1'}>
                                        {film.directorFirstName + " " + film.directorLastName}
                                    </Typography>
                                    <Typography variant={'subtitle1'}>
                                        {new Date(film.releaseDate).getFullYear()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant={'h3'}>
                                        {film.rating}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Stack>
            </Container>
        </ThemeProvider>
    )
}

export default Films;