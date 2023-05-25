import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import apiClient from "../defaults/axios-config";

import {
    Box,
    Container,
    Stack
} from "@mui/material";
import ErrorPage from "./Error";
import {defaultFilm} from "../defaults/defaults";
import {FilmDetailed, SimilarFilms} from "../components/FilmComponents";
import {ReviewList} from "../components/Review";

const Film = () => {

    const { id } = useParams();
    const url = "/films/" + id;
    const [film, setFilm] = useState<Film>(defaultFilm);
    const [errorFlag, setErrorFlag] = useState(true);
    const [errorMessage, setErrorMessage] = React.useState("");

    const getFilm = async () => {
        const response = await apiClient.get(url);

        if (response.status === 200) {
            setErrorFlag(false)
            setFilm(response.data)
        } else {
            setErrorFlag(true);
            setErrorMessage(response.status.toString());
        }
    }

    useEffect(() => {
        getFilm()
    }, [errorFlag])

    if (errorFlag) {
        return <ErrorPage errorMessage={errorMessage}/>
    }

    return (
        <Box>
            <Stack spacing={3}>
                <Box sx={{bgcolor: "bgPrimary.main"}}>
                    <Container sx={{ py: 8, mx: "auto" }} maxWidth="lg">
                        <FilmDetailed film={film}/>
                    </Container>
                </Box>
                <Box>
                    <Container sx={{ py: 4, mx: "auto" }} maxWidth="lg">
                        <ReviewList filmId={film.filmId} errorFlag setErrorFlag={setErrorFlag}/>
                    </Container>
                </Box>
                <Box>
                    <Container sx={{ py: 4, mx: "auto" }} maxWidth="lg">
                        <SimilarFilms film={film}/>
                    </Container>
                </Box>
            </Stack>
        </Box>
    )
}

export default Film