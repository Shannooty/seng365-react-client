import React, {ChangeEvent} from "react";
import apiClient from "../defaults/axios-config";

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Grid, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Stack,
    Typography
} from "@mui/material";
import {SearchContext} from "../contexts/search-context";
import {FilmSimpleList} from "../components/FilmComponents";
import {ageRatings, getGenres} from "../services/FilmService";


const Films = () => {
    const url = "/films"

    const {searchTerm} = React.useContext(SearchContext);

    const [films, setFilms] = React.useState < Array < Film >> ([]);
    const [genres, setGenres] = React.useState < Array < Genre >> ([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = React.useState <string[]> ([]);
    const [selectedGenres, setSelectedGenres] = React.useState <string[]> ([]);
    const [selectedSort, setSelectedSort] = React.useState ('RELEASED_ASC');
    const [currentPage, setCurrentPage] = React.useState (1);
    const [numPages, setnumPages] = React.useState (0);

    const numPerPage = 9;
    const sortBy = new Map();
    sortBy.set("ALPHABETICAL_ASC", "A-Z");
    sortBy.set("ALPHABETICAL_DESC", "Z-A");
    sortBy.set("RELEASED_DESC", "Newest First");
    sortBy.set("RELEASED_ASC", "Oldest First");
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

        const searchParam = searchTerm === '' ? '' : `q=${searchTerm}&`

        const query = url + "?" + searchParam + genreParams + ageParams + sortParams + count + startIndex;

        apiClient.get(query)
            .then((response) => {
                setFilms(response.data.films)
                setnumPages(Math.ceil(response.data.count / numPerPage));
            })
    }

    React.useEffect(() => {
        getFilms();
        getGenres().then((genres) => {
            if (genres instanceof Array<Genre>) {
                setGenres(genres);
            }
        });
    }, [currentPage, searchTerm])

    return (

        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <FilmSimpleList films={films}/>
                </Grid>
                <Grid item xs={12} sm={4}>
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
            <Stack sx={{ py: 4 }} alignItems="center">
                <Pagination size={'large'} count={numPages} page={currentPage} onChange={handlePagination} shape="rounded" />
            </Stack>
        </Container>
    )
}

export default Films;