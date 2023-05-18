import React, {ChangeEvent} from "react";
import axios from "axios";
import {theme} from "../theme";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Grid, InputLabel, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Stack,
    ThemeProvider,
    Typography
} from "@mui/material";
import {BASE_URL} from "../index";


const Films = () => {
    const url = BASE_URL + "/films"

    const [films, setFilms] = React.useState < Array < Film >> ([]);
    const [genres, setGenres] = React.useState < Array < Genre >> ([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = React.useState <string[]> ([]);
    const [selectedGenres, setSelectedGenres] = React.useState <string[]> ([]);
    const [selectedSort, setSelectedSort] = React.useState ('RELEASED_ASC');
    const [currentPage, setCurrentPage] = React.useState (1);
    const [numPages, setnumPages] = React.useState (0);

    const numPerPage = 10;
    const ageRatings = ["G", "PG", "M", "R13", "R16", "R18", "TBC"]
    const sortBy = new Map();
    sortBy.set("ALPHABETICAL_ASC", "A-Z");
    sortBy.set("ALPHABETICAL_DESC", "Z-A");
    sortBy.set("RELEASED_DESC", "Newest");
    sortBy.set("RELEASED_ASC", "Oldest");
    sortBy.set("RATING_DESC", "Highest Rated");
    sortBy.set("RATING_ASC", "Lowest Rated");



    const handleGenre = (event: SelectChangeEvent<string[]>) => {
        // @ts-ignore
        setSelectedGenres(event.target.value);
    };
    const handleAgeRating = (event: SelectChangeEvent<string[]>) => {
        // @ts-ignore
        setSelectedAgeRatings(event.target.value);
    };

    const handleSort = (event: SelectChangeEvent) => {
        setSelectedSort(event.target.value);
    }

    const handlePagination = async (event: ChangeEvent<unknown>, value : number) => {
        setCurrentPage(value)
    }

    const getFilms = async () => {
        let genreParams = "";
        for (const genreId of selectedGenres) {
            genreParams += `genreIds=${genreId}&`
        }

        let ageParams = "";
        for (const ageRating of selectedAgeRatings) {
            ageParams += `ageRatings=${ageRating}&`
        }

        let sortParams = `sortBy=${selectedSort}&`
        let count = `count=${numPerPage}&`
        let startIndex = `startIndex=${(currentPage - 1) * numPerPage}&`

        console.log(count + startIndex)

        axios.get(url + "?" + genreParams + ageParams + sortParams + count + startIndex)
            .then((response) => {
                setFilms(response.data.films)
                setnumPages(Math.ceil(response.data.count / numPerPage));
            })
    }

    React.useEffect(() => {

        const getGenres = async () => {
            await axios.get(url + '/genres')
                .then((response) => {
                    setGenres(response.data)
                })
        }
        getFilms();
        getGenres();
    }, [currentPage])

    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ py: 8 }} maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={8}>
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
                    </Grid>
                    <Grid item xs={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography>
                                    Filters
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: "center"}} alignItems={"center"}>
                                    <InputLabel id="genreFilterLabel">Genre</InputLabel>
                                    <Select
                                        multiple
                                        labelId="genreFilterLabel"
                                        id="genreFilterSelect"
                                        value={selectedGenres}
                                        onChange={handleGenre}
                                        autoWidth
                                    >
                                        {genres.map((genre : Genre) => (
                                            <MenuItem key={genre.genreId} value={genre.genreId}>{genre.name}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: "center"}} alignItems={"center"}>
                                    <InputLabel id="ageFilterLabel">Age Rating</InputLabel>
                                    <Select
                                        labelId="ageFilterLabel"
                                        id="ageFilterSelect"
                                        multiple
                                        value={selectedAgeRatings}
                                        onChange={handleAgeRating}
                                        autoWidth
                                    >
                                        {ageRatings.map((ageRating : string) => (
                                            <MenuItem key={ageRating} value={ageRating}>{ageRating}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Typography>
                                    Sort
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: "center"}} alignItems={"center"}>
                                    <InputLabel id="sortByLabel">Sort By</InputLabel>
                                    <Select
                                        labelId="sortByLabel"
                                        id="sortBySelect"
                                        value={selectedSort}
                                        onChange={handleSort}
                                        autoWidth
                                    >
                                        {Array.from(sortBy.keys()).map((sortKey : string) => (
                                            <MenuItem value={sortKey}>{sortBy.get(sortKey)}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                            </CardContent>
                            <CardActions>
                                <Button variant="outlined"
                                        onClick={getFilms}>
                                    Apply
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <Stack alignItems="center">
                    <Pagination count={numPages} page={currentPage} onChange={handlePagination} shape="rounded" />
                </Stack>
            </Container>
        </ThemeProvider>
    )
}

export default Films;