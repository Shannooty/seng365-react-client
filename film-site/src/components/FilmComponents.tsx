import {Box, Card, CardContent, CardMedia, Divider, List, ListItem, Stack, Typography} from "@mui/material";
import {BASE_URL} from "../index";
import {FiberManualRecord, Star} from "@mui/icons-material";
import React from "react";
import {UserSmall} from "./UserSmall";

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

export const FilmSimple = (params: {film: Film}) => {
    const film = params.film;

    return (
        <Card>
            <CardMedia
                sx={{ height: 140 }}
                image={BASE_URL + "/films/" + film.filmId + "/image"}
                title={film.title}
            />
            <CardContent>
                <FilmTitle film={film}/>
            </CardContent>
        </Card>
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
                    alt="random"
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