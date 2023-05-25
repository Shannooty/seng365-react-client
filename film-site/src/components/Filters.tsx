import React from "react";
import {
    Box,
    Button,
    CardActions, FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import {ageRatings, getGenres} from "../services/FilmService";
import {useNavigate} from "react-router-dom";
import {SearchContext} from "../contexts/search-context";

export const Filters = (params: {setQuery: Function}) => {

    const {searchTerm} = React.useContext(SearchContext);

    const [genres, setGenres] = React.useState < Array < Genre >> ([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = React.useState <string[]> ([]);
    const [selectedGenres, setSelectedGenres] = React.useState <string[]> ([]);
    const [selectedSort, setSelectedSort] = React.useState ('RELEASED_ASC');

    const sortBy = new Map();
    sortBy.set("ALPHABETICAL_ASC", "A-Z");
    sortBy.set("ALPHABETICAL_DESC", "Z-A");
    sortBy.set("RELEASED_DESC", "Newest First");
    sortBy.set("RELEASED_ASC", "Oldest First");
    sortBy.set("RATING_DESC", "Highest Rated");
    sortBy.set("RATING_ASC", "Lowest Rated");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        updateFilters();
    }

    const updateFilters = () => {
        let query = `sortBy=${selectedSort}&`;

        for (const genreId of selectedGenres) {
            query += `genreIds=${genreId}&`;
        }

        for (const ageRating of selectedAgeRatings) {
            query += `ageRatings=${ageRating}&`
        }

        params.setQuery(query);
    }

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

    const setSelects = async () => {
        const response = await getGenres();
        setGenres(response)
    }

    function handleReset() {
        setSelectedSort('RELEASED_ASC');
        setSelectedAgeRatings([]);
        setSelectedGenres([]);
    }

    React.useEffect(() => {
        setSelects();
        updateFilters();
    }, [searchTerm])

    return (
        <Paper elevation={2}>
            <Stack component="form" noValidate onSubmit={handleSubmit} py={1} mx={2} spacing={2}>
                <Typography>
                    Filters
                </Typography>
                <FormControl>
                    <InputLabel id="genreFilterLabel">Genre</InputLabel>
                    <Select
                        multiple
                        labelId="genreFilterLabel"
                        id="genreFilterSelect"
                        label="Genre"
                        value={selectedGenres}
                        onChange={handleGenre}
                    >
                        {genres.map((genre : Genre) => (
                            <MenuItem key={genre.genreId} value={genre.genreId}>{genre.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="ageFilterLabel">Age Rating</InputLabel>
                    <Select
                        labelId="ageFilterLabel"
                        id="ageFilterSelect"
                        label="Age Rating"
                        multiple
                        value={selectedAgeRatings}
                        onChange={handleAgeRating}
                    >
                        {ageRatings.map((ageRating : string) => (
                            <MenuItem key={ageRating} value={ageRating}>{ageRating}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography>
                    Sort
                </Typography>
                <FormControl>
                    <InputLabel id="sortByLabel">Sort By</InputLabel>
                    <Select
                        labelId="sortByLabel"
                        id="sortBySelect"
                        label="Sort By"
                        value={selectedSort}
                        onChange={handleSort}
                    >
                        {Array.from(sortBy.keys()).map((sortKey : string) => (
                            <MenuItem key={sortKey} value={sortKey}>{sortBy.get(sortKey)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained"
                        type="submit">
                    Apply
                </Button>
                <Button variant="contained"
                        onClick={handleReset}>
                    Reset Filters
                </Button>
            </Stack>
        </Paper>
    )
}