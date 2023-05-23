import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {BASE_URL} from "../index";
import axios from "axios";
import {
    Box,
    Container,
    Stack
} from "@mui/material";
import ErrorPage from "./Error";
import {defaultFilm} from "../defaults/defaults";
import {FilmDetailed} from "../components/FilmDetailed";
import {ReviewList} from "../components/Review";

const Film = () => {

    const { id } = useParams();
    const url = BASE_URL + "/films/" + id;
    const [film, setFilm] = useState<Film>(defaultFilm);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

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

    useEffect(() => {
        getFilm()
    }, [errorFlag])

    if (errorFlag) {
        return <ErrorPage errorMessage={errorMessage}/>
    }

    return (
        <Box>
            <Stack spacing={3}>
                <Box sx={{zIndex: 'modal', bgcolor: "bgPrimary.main"}}>
                    <Container sx={{ py: 8, mx: "auto" }} maxWidth="lg">
                        <FilmDetailed film={film}/>
                    </Container>
                </Box>
                <Box>
                    <Container sx={{ py: 4, mx: "auto" }} maxWidth="lg">
                        <ReviewList filmId={film.filmId} errorFlag setErrorFlag={setErrorFlag}/>
                    </Container>
                </Box>
            </Stack>
        </Box>
    )
}

export default Film