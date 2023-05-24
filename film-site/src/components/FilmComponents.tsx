import {Box, Card, CardContent, CardMedia, Divider, List, ListItem, Stack, Typography} from "@mui/material";
import {BASE_URL} from "../index";
import {FiberManualRecord, Star} from "@mui/icons-material";
import React from "react";
import {UserSmall} from "./UserSmall";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import {Link as RouterLink} from "react-router-dom";

export const SimilarFilms = (params : {film: Film}) => {
    const film = params.film;
    const [similarFilms, setSimilarFilms] = React.useState< Array<Film>>([])
    let groupByN = (n : number, arr : Film[]) => {
        let result = [];
        for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n));
        return result;
    };
    const getFilms = async () => {
        const similarGenresFilms = await axios.get(BASE_URL + `/films?genreIds=${film.genreId}`)
        const similarDirectorFilms = await axios.get(BASE_URL + `/films?directorId=${film.directorId}`)

        if (similarGenresFilms.status === 200 && similarDirectorFilms.status === 200) {
            const similarGenresFilmIds = similarGenresFilms.data.films.map((film: Film) => (film.filmId))
            const filmList = similarDirectorFilms.data.films.filter((directorFilm: Film) => !similarGenresFilmIds.includes(directorFilm.filmId))
            const combinedFilms = [...filmList, ...similarGenresFilms.data.films]
            setSimilarFilms(combinedFilms.filter((similarFilm: Film) => similarFilm.filmId !== film.filmId));
        }
    }
    React.useEffect(() => {
        getFilms();
    }, [film])

    return (
        <Box sx={{bgcolor: "bgPrimary.main"}} alignItems={'center'}>
            <Typography display={'flex'} mx={2} py={3} variant={'h4'}>
                {"Similar Films"}
            </Typography>
            <Carousel sx={{mx: 3}} navButtonsAlwaysVisible>
                {groupByN(3, similarFilms).map((films: Film[]) => (
                    <FilmSimpleList films={films}/>
                ))}
            </Carousel>
        </Box>

    )
}
const FilmTitle = (params: {film: Film}) => {
    const film = params.film
    return (
        <Box display={'flex'} gap={3} flexWrap={'wrap'} alignItems={'center'} alignContent={'flex-end'}>
            <Typography color={"primary"} variant={'h3'}>
                {film.title}
            </Typography>
            <FiberManualRecord/>
            <Typography color={"primary"} variant={'h3'}>
                {film.ageRating}
            </Typography>
            <Typography color={"secondary"} variant={'h4'}>
                {"(" + new Date(film.releaseDate).getFullYear() + ")"}
            </Typography>
        </Box>
    )
}

export const FilmSimpleList = (params: {films : Film[]}) => {
    return (
        <Box sx={{ mx: 3, justifyItems: 'center', display: "grid", gridAutoRows: 'auto', gridTemplateColumns: {xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))"}}}>
            {params.films.map((film: Film) => (
                <FilmSimple film={film}/>
            ))}
        </Box>
    )
}

export const FilmSimple = (params: {film: Film}) => {
    const film = params.film;

    return (
        <Box sx={{height: "90%", width: "80%"}}>
            <RouterLink style={{textDecoration: 'none'}} to={`/film/${film.filmId}`}>
                <Card sx={{height: "100%"}}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={BASE_URL + "/films/" + film.filmId + "/image"}
                        title={film.title}
                    />
                    <CardContent>
                        <Box display={'flex'} justifyContent={"space-between"}>
                            <FilmTitle film={film}/>
                            <Box display={'flex'}>
                                <Typography variant={'h4'}>
                                    {film.rating}
                                </Typography>
                                <Star sx={{color: 'gold', fontSize:'35px'}}/>
                            </Box>
                        </Box>

                    </CardContent>
                </Card>
            </RouterLink>
        </Box>
    )
}

export const FilmDetailed = (props : {film: Film}) => {
    const film = props.film;
    return (
        <Stack gap={3}>
            {/*Title*/}
            <FilmTitle film={film}/>

            {/*Hero image and rating*/}
            <Box display={'flex'} gap={5} flexWrap={'wrap'} justifyContent={'flex-start'} alignItems={'center'}>
                <Box
                    component="img"
                    sx={{
                        height: 'auto',
                        width: '100%',
                        maxWidth: '300px'
                    }}
                    src={BASE_URL + "/films/" + film.filmId + "/image"}
                    alt={film.title}
                />

                {/* Rating */}
                <Stack spacing={3} alignItems={'center'}>
                    <Box>
                        <Typography color={"primary"} variant={'h4'}>
                            Rating
                        </Typography>
                        <Typography color={"primary"} variant={'h4'}>
                            {film.rating + " / 10 "}
                            <Star sx={{color: 'gold', fontSize:'35px'}}/>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography color={"primary"} variant={'h4'}>
                            Your Rating
                        </Typography>
                        <Typography color={"primary"} variant={'h4'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            {film.rating + " / 10 "}
                            <Star sx={{color: 'gold', fontSize:'35px'}}/>
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* FilmComponents info */}
            <List>

                <Divider orientation={'horizontal'}/>
                <ListItem>
                    <Typography width={'100%'} variant={'h4'} fontWeight='bold'>
                        Director
                    </Typography>
                </ListItem>
                <ListItem sx={{mx : 5}} >
                    <UserSmall userId={film.directorId}/>
                </ListItem>
                <Divider orientation={'horizontal'}/>
                <ListItem>
                    <Typography width={'100%'} variant={'h4'} fontWeight='bold'>
                        Description
                    </Typography>
                </ListItem>
                <ListItem sx={{mx : 5}}>
                    <Typography variant={'h5'}>
                        {film.description}
                    </Typography>
                </ListItem>
            </List>
        </Stack>
    )
}