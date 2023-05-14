import React from "react";
import axios from "axios";
import {theme} from "../theme";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    ThemeProvider,
    Typography
} from "@mui/material";


const Films = () => {

    const [films, setFilms] = React.useState < Array < Film >> ([])

    React.useEffect(() => {
        const getFilms = async () => {
            await axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films')
                .then((response) => {
                    setFilms(response.data.films)
                })
        }
        getFilms()
    }, [])


    return (
        <ThemeProvider theme={theme}>
            <Container sx={{ py: 8 }} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={4}>
                    {films.map((film : Film) => (
                        <Grid item key={film.filmId} xs={12} sm={6} md={4}>
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardMedia
                                    component="img"
                                    image={'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + film.filmId + "/image"}
                                    alt="random"
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {film.title}
                                    </Typography>
                                    <Typography>
                                        {film.rating}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">View</Button>
                                    <Button size="small">Edit</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default Films;