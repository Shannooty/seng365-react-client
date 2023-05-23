import React from "react";
import {BASE_URL} from "../index";
import {Box, Divider, List, ListItem, Stack, Typography} from "@mui/material";
import {FiberManualRecord, Star} from "@mui/icons-material";
import {UserSmall} from "./UserSmall";

const FilmDetailed = (props : {film: Film}) => {
    const film = props.film;
    return (
        <Stack gap={3}>
            {/*Title*/}
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

            {/* Film info */}
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

export {FilmDetailed}