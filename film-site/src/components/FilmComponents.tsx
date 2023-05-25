import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog, DialogContent, DialogTitle,
    Divider,
    List,
    ListItem,
    Stack,
    Typography
} from "@mui/material";
import {FiberManualRecord, Star} from "@mui/icons-material";
import React from "react";
import {UserSmall} from "./UserSmall";
import Carousel from "react-material-ui-carousel";
import apiClient from "../defaults/axios-config";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {FilmForm} from "./FilmForm";
import dayjs from "dayjs";
import {deleteFilm} from "../services/FilmService";

export const SimilarFilms = (params : {film: Film}) => {
    const film = params.film;
    const [similarFilms, setSimilarFilms] = React.useState< Array<Film>>([])
    let groupByN = (n : number, arr : Film[]) => {
        let result = [];
        for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n));
        return result;
    };
    const getFilms = async () => {
        const similarGenresFilms = await apiClient.get(`/films?genreIds=${film.genreId}`)
        const similarDirectorFilms = await apiClient.get(`/films?directorId=${film.directorId}`)

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
            <RouterLink style={{textDecoration: 'none'}} to={`/films/${film.filmId}`}>
                <Card sx={{height: "100%"}}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={apiClient.defaults.baseURL + "/films/" + film.filmId + "/image"}
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
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);

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
                    src={apiClient.defaults.baseURL + "/films/" + film.filmId + "/image"}
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
                {film.directorId.toString() === localStorage.getItem("userId") && dayjs(film.releaseDate) > dayjs() ? (
                        <><Divider orientation={'horizontal'}/>
                            <ListItem>
                                <Box display={'inline-flex'} gap={2}>
                                    <Button variant={'contained'} onClick={() => {setOpenEdit(true)}}>Edit Film</Button>
                                    <FilmForm open={openEdit} setOpen={setOpenEdit} edit={true} filmId={film.filmId}/>
                                    <Button variant={'contained'} color={'error'} onClick={() => {setOpenDelete(true)}}>Delete Film</Button>
                                    <DeleteFilm filmId={film.filmId} open={openDelete} setOpen={setOpenDelete}/>
                                </Box>
                            </ListItem></>
                    )
                    :
                    (
                        <Box/>
                    )}
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

const DeleteFilm = (params: {filmId : number, open: boolean, setOpen: Function}) => {

    const navigate = useNavigate();
    function handleClose() {
        params.setOpen(false);
    }

    const handleDelete= async () => {
        await deleteFilm(params.filmId)
        handleClose();
        navigate('/');
    }

    return (
        <Dialog
            open={params.open}
            onClose={handleClose}>
            <DialogTitle>
                Confirm Delete Film
            </DialogTitle>
            <DialogContent>
                <Box display={'inline-flex'} gap={2}>
                    <Button onClick={handleDelete} color={'error'} variant={'contained'}>Delete Film</Button>
                    <Button onClick={handleClose} variant={'contained'}>Cancel</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}