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
import {getFilm} from "../services/FilmService";

const Film = (params: {setLoginOpen: Function}) => {

    const { id } = useParams();
    const [film, setFilm] = useState<Film>(defaultFilm);
    const [errorFlag, setErrorFlag] = useState(true);
    const [errorMessage, setErrorMessage] = React.useState("");

    const getTheFilm = async () => {
        const response = await getFilm(id);

        if (response.status === 200) {
            setErrorFlag(false)
            setFilm(response.data)
        } else {
            setErrorFlag(true);
            setErrorMessage(response.status.toString());
        }
    }

    useEffect(() => {
        getTheFilm()
    }, [id])

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
                        <ReviewList film={film} errorFlag setErrorFlag={setErrorFlag} setLoginOpen={params.setLoginOpen}/>
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