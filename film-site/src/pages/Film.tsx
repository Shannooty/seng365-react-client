import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {BASE_URL} from "../index";
import axios from "axios";
import {Avatar, Box, Container, Divider, Grid, List, Paper, Stack, Typography} from "@mui/material";
import ErrorPage from "./Error";
import {deepOrange} from "@mui/material/colors";
import {defaultFilm, defaultUser} from "../defaults/defaults";
import {Star} from "@mui/icons-material";

const Film = () => {

    const { id } = useParams();
    const url = BASE_URL + "/films/" + id;
    const [film, setFilm] = useState<Film>(defaultFilm);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [director, setDirector] = useState<User>(defaultUser);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")


    const getFilm = () => {
        axios.get(url)
            .then((response) => {
                setErrorFlag(false)
                setFilm(response.data)
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }

    const getReviews = () => {
        axios.get(url + "/reviews")
            .then((response) => {
                setErrorFlag(false)
                setReviews(response.data)
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }

    const getDirector = (film: Film) => {
        axios.get(BASE_URL + `/users/${film.directorId}`)
            .then((response) => {
                setErrorFlag(false)
                setDirector(response.data)
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }

    useEffect(() => {

        getFilm()
        getReviews()
        getDirector(film)
        console.log(1)
    }, [errorFlag])

    if (errorFlag) {
        return <ErrorPage errorMessage={errorMessage}/>
    }
    return (
        <Container sx={{ py: 8, mx: "auto" }} maxWidth="lg">
            <Stack spacing={3}>
                <Paper elevation={3}>
                    <List>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={4}>
                                <Box
                                    component="img"
                                    sx={{
                                        height: 'auto',
                                        width: '100%',
                                    }}
                                    src={BASE_URL + "/films/" + film.filmId + "/image"}
                                    alt="random"
                                />
                            </Grid>
                            <Grid item xs={8} alignItems="center" justifyContent="center">
                                <Stack spacing={2}>
                                    <Typography variant={'h2'}>
                                        {film.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems:"center", justifyContent:"center"}}>
                                        <Typography variant={'h3'}>
                                            {"Directed by"}
                                        </Typography>
                                        <Avatar
                                            sx={{ bgcolor: deepOrange[500], width: "60px", height: "60px" }}
                                            src={BASE_URL + "/users/" + film.directorId + "/image"}
                                            alt={director.firstName}
                                        />
                                        <Typography variant={"h3"}>
                                            {director.firstName + " " + director.lastName}
                                        </Typography>
                                    </Box>
                                    <Typography variant={'h4'}>
                                        {"Released " + new Date(film.releaseDate).getFullYear()}
                                    </Typography>
                                    <Box sx={{display: 'flex', gap: 2, alignItems:"center", justifyContent:"center"}}>
                                        <Typography variant={'h4'}>
                                            {film.rating + " / 10 "}
                                        </Typography>
                                        <Star sx={{color: 'gold', fontSize: "30px"}}/>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Divider orientation={"horizontal"}/>
                        <Typography variant={'h4'}>
                            Description
                        </Typography>
                        <Typography variant={'h5'}>
                            {film.description}
                        </Typography>
                    </List>
                </Paper>
                <Paper elevation={3}>
                    <List>
                        <Typography variant={'h4'}>
                            Reviews
                        </Typography>
                        <Divider orientation={"horizontal"}/>
                        {reviews.map((review: Review) => {
                            return(<Paper elevation={3} sx={{m: 3}}>
                                <List>
                                    <Grid container display={"flex"} alignItems="center" justifyContent="space-between">
                                        <Grid item xs={2}>
                                            <Avatar
                                                sx={{
                                                    height: '60px',
                                                    width: '60px',
                                                }}
                                                src={BASE_URL + "/users/" + review.reviewerId + "/image"}
                                                alt={review.reviewerFirstName}
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant={'h5'}>
                                                {review.reviewerFirstName + " " + review.reviewerLastName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant={'h4'}>
                                                {review.rating}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider orientation={"horizontal"}/>
                                    <Typography variant={'h5'} fontStyle={review.review ? "normal" : "italic"} sx={{py: 2}}>
                                        {review.review ? review.review : "No review"}
                                    </Typography>
                                </List>
                            </Paper>)
                        })}

                    </List>
                </Paper>
            </Stack>
        </Container>
    )
}

export default Film