import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    List,
    ListItem,
    Pagination,
    Stack,
    Typography
} from "@mui/material";
import {FiberManualRecord, Star} from "@mui/icons-material";
import React, {ChangeEvent} from "react";
import {UserSmall} from "./UserSmall";
import Carousel from "react-material-ui-carousel";
import apiClient from "../defaults/axios-config";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {FilmForm} from "./Forms";
import dayjs from "dayjs";
import {deleteFilm, getFilms, getGenre} from "../services/FilmService";

import {getUserId} from "../services/UserService";

export const SimilarFilms = (params : {film: Film}) => {
    const film = params.film;
    const [similarFilms, setSimilarFilms] = React.useState< Array<Film>>([])

    const [numArry, setNumArry] = React.useState< IterableIterator<[number, number]>>([1].entries())

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
        let result = []
        for (let i = 0; i < (similarFilms.length / 3) + 1; i ++) {
            result.push(i);
        }
        setNumArry(result.entries())

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
                    <FilmSimpleList key={numArry.next().value} films={films}/>
                ))}
            </Carousel>
        </Box>

    )
}
const FilmTitle = (params: {film: Film}) => {
    const film = params.film
    return (
        <Box display={'flex'} gap={3} flexWrap={'wrap'} alignItems={'center'} alignContent={'flex-end'}>
            <Typography variant={'h3'}>
                {film.title}
            </Typography>
            <FiberManualRecord/>
            <Typography variant={'h3'}>
                {film.ageRating}
            </Typography>
            <Typography color={"secondary"} variant={'h4'}>
                {"(" + new Date(film.releaseDate).getFullYear() + ")"}
            </Typography>
        </Box>
    )
}

export const FilmSimpleList = (params: {films: Film[]}) => {
    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
                {params.films.map((film: Film) => (
                    <Grid item key={film.filmId} xs={12} sm={6} md={4}>
                        <FilmSimple film={film}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export const FilmQueryList = (params: {query: string}) => {

    const [films, setFilms] = React.useState<Array<Film>>(new Array<Film>);
    const [currentPage, setCurrentPage] = React.useState (1);
    const [numPages, setNumPages] = React.useState (0);

    const numPerPage = 9;
    const handlePagination = async (event: ChangeEvent<unknown>, value : number) => {
        setCurrentPage(value)
    }

    const getFilmsList = async () => {

        let count = `count=${numPerPage}&`
        let startIndex = `startIndex=${(currentPage - 1) * numPerPage}`

        const query = params.query + count + startIndex;

        console.log(query)

        const response = await getFilms(query);
        setFilms(response.data.films)
        setNumPages(Math.ceil(response.data.count / numPerPage))
    }

    React.useEffect(() => {
        if (params.query !== '') {
            getFilmsList();
        }
    }, [currentPage, params.query])

    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
                {films.map((film: Film) => (
                    <Grid item key={film.filmId} xs={12} sm={6} md={4}>
                        <FilmSimple film={film}/>
                    </Grid>
                ))}
            </Grid>
            <Stack sx={{ py: 4 }} alignItems="center">
                <Pagination size={'large'} count={numPages} page={currentPage} onChange={handlePagination} shape="rounded" />
            </Stack>
        </Container>
    )
}

export const FilmSimple = (params: {film: Film}) => {
    const film = params.film;
    const [genre, setGenre] = React.useState('')

    const setUpGenre = async () => {
        const genreReq = await getGenre(film);
        setGenre(genreReq.name);
    }

    React.useEffect(() => {
        setUpGenre()

    },[])

    return (
        <RouterLink style={{textDecoration: 'none'}} to={`/films/${film.filmId}`}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                    component="div"
                    sx={{
                        // 16:9
                        pt: '100%',
                    }}
                    image={apiClient.defaults.baseURL + "/films/" + film.filmId + "/image"}
                    title={film.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box display={'flex-wrap'} justifyContent={"space-between"}>
                        <Typography variant={'h5'}>{film.title}</Typography>
                        <Typography variant={'h6'}>{genre}</Typography>
                        <Box display={'flex'} gap={2} justifyContent={'center'}>
                            <Typography variant={'h6'}>{"(" + new Date(film.releaseDate).getFullYear() + ")"}</Typography>
                            <Typography variant={'h6'}>{film.ageRating}</Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'center'}>
                            <Typography variant={'h4'}>
                                {film.rating}
                            </Typography>
                            <Star sx={{color: 'gold', fontSize:'35px'}}/>
                        </Box>
                        <UserSmall userId={film.directorId}/>

                    </Box>

                </CardContent>
            </Card>
        </RouterLink>
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
                        <Typography variant={'h4'}>
                            Rating
                        </Typography>
                        <Typography variant={'h4'}>
                            {film.rating + " / 10 "}
                            <Star sx={{color: 'gold', fontSize:'35px'}}/>
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* FilmComponents info */}
            <List>
                {film.directorId.toString() === getUserId() ? (
                        <><Divider orientation={'horizontal'}/>
                            <ListItem>
                                <Box display={'inline-flex'} gap={2}>
                                    {dayjs(film.releaseDate) <= dayjs() || film.numReviews > 0 ? (<></>) :
                                        (
                                            <Box>
                                                <Button variant={'contained'} onClick={() => {setOpenEdit(true)}}>Edit Film</Button>
                                                <FilmForm open={openEdit} setOpen={setOpenEdit} edit={true} filmId={film.filmId}/>
                                            </Box>

                                        )
                                    }
                                    <Button variant={'contained'} color={'error'} onClick={() => {setOpenDelete(true)}}>Delete Film</Button>
                                    <DeleteFilm filmId={film.filmId} open={openDelete} setOpen={setOpenDelete}/>
                                </Box>
                            </ListItem></>
                    )
                    :
                    (
                        <></>
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