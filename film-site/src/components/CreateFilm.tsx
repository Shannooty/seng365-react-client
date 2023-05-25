import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle, FormControl,
    FormHelperText,
    Grid, InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select, SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import {AddAPhoto} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {ChangeEvent} from "react";
import {ageRatings, createFilm, getGenres} from "../services/FilmService";
import {login} from "../services/UserService";

export const CreateFilm = (params: {open: boolean, setOpen: Function}) => {

    const [genres, setGenres] = React.useState < Array < Genre >> ([]);
    const [selectedGenre, setSelectedGenre] = React.useState('');
    const [selectedAgeRating, setSelectedAgeRating] = React.useState ('TBC');
    const [selectedDate, setSelectedDate] = React.useState(dayjs().add(1,'day').toDate());
    const [imageName, setImageName] = React.useState('');
    const [invalidImage, setInvalidImage] = React.useState(false);
    const [invalidTitle, setInvalidTitle] = React.useState(false);
    const [invalidDescription, setInvalidDescription] = React.useState(false);
    const [invalidGenre, setInvalidGenre] = React.useState(false);
    const [invalidRuntime, setInvalidRuntime] = React.useState(false);

    function handleClose() {
        params.setOpen(false);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        setInvalidImage(false);
        const image = (data.get("image") as File)
        if (!data.get("image")|| !allowedFiles.includes(image.type)) {
            setInvalidImage(true);
            return;
        }
        const date = selectedDate.toISOString().replace("T", " ").split('.')[0]
        const createFilmResponse = await createFilm(data.get('title'), data.get('description'), selectedGenre, date, selectedAgeRating, parseInt(data.get('runtime') as string), image);

        setInvalidTitle(false);
        setInvalidDescription(false);
        setInvalidGenre(false);
        setInvalidRuntime(false);

        switch (createFilmResponse.status) {
            case 201:
                window.location.href = `/films/${createFilmResponse.data.filmId}`;
                break;
            case 400:
                const statusMessage: string = createFilmResponse.statusText;
                console.log(statusMessage)

                if (statusMessage.includes("title")) {
                    setInvalidTitle(true);
                } else if (statusMessage.includes("description")) {
                    setInvalidDescription(true);
                } else if (statusMessage.includes("genre")) {
                    setInvalidGenre(true);
                } else if (statusMessage.includes("runtime")) {
                    setInvalidRuntime(true);
                }
                break;
            default:
                break;
        }
    }

    function handleGenre(event: SelectChangeEvent) {
        setSelectedGenre(event.target.value)
    }

    const allowedFiles = ["image/gif","image/jpeg","image/png","image/jpg"];

    function handleImage(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (files && files.length > 0) {
            setImageName(files[0].name)
            if (!allowedFiles.includes(files[0].type)) {
                setInvalidImage(true);
            }
        } else {
            setImageName('')
        }
    }

    function handleAgeRating(event: SelectChangeEvent) {
        setSelectedAgeRating(event.target.value);
    }

    function handleDate(day: Dayjs | null) {
        if (day) {
            setSelectedDate(day.toDate());
        }
    }

    React.useEffect(() => {
        if (params.open) {
            getGenres().then((genres) => {
                if (genres instanceof Array<Genre>) {
                    setGenres(genres);
                }
            });
        }

    }, [imageName])

    return (
        <Dialog
            open={params.open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>Create Film</DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate onSubmit={handleSubmit} py={1} spacing={2}>
                    <TextField
                        error={invalidTitle}
                        name="title"
                        required
                        fullWidth
                        id="title"
                        label="Film Title"
                        autoFocus
                        helperText={invalidTitle ? 'Title is required and must be unique' : ''}
                    />
                    <TextField
                        error={invalidDescription}
                        name="description"
                        multiline
                        minRows={2}
                        maxRows={5}
                        required
                        fullWidth
                        id="description"
                        label="Description"
                        helperText={invalidDescription ? 'Description is required' : ''}
                    />
                    <FormControl>
                        <InputLabel required id="genre-select-label">Genre</InputLabel>
                        <Select
                            error={invalidGenre}
                            id="genre"
                            value={selectedGenre}
                            onChange={handleGenre}
                            labelId="genre-select-label"
                            label="Label"
                            required
                        >
                            {genres.map((genre: Genre) => (
                                <MenuItem key={genre.genreId} value={genre.genreId}>{genre.name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{invalidGenre ? 'Genre is required' : ''}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <InputLabel required id="age-select-label">Age Rating</InputLabel>
                        <Select
                            id="ageRating"
                            value={selectedAgeRating}
                            onChange={handleAgeRating}
                            labelId="age-select-label"
                            label="Label"
                        >
                            {ageRatings.map((ageRating : string) => (
                                <MenuItem key={ageRating} value={ageRating}>{ageRating}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker onChange={handleDate} label={"Release Date"} minDate={dayjs().add(1,'day')} defaultValue={dayjs().add(1,'day')}/>
                    </LocalizationProvider>
                    <TextField
                        error={invalidRuntime}
                        name="runtime"
                        required
                        fullWidth
                        id="runtime"
                        label="Runtime (minutes)"
                        type="number"
                        helperText={invalidRuntime ? 'Runtime is required and must be at least 1 minute' : ''}
                    />
                    <Box>
                        <Button
                            sx={{alignSelf: 'center'}}
                            variant="contained"
                            component="label"
                            endIcon={<AddAPhoto/>}
                        >
                            Upload Image
                            <input
                                onChange={handleImage}
                                name="image"
                                id="image"
                                accept="image/gif,image/jpeg,image/png"
                                type="file"
                                hidden
                            />
                        </Button>
                        <Typography color={invalidImage? 'error' : 'secondary'} variant={'subtitle1'}>{invalidImage? "Invalid image type, must be (.gif, .png, .jpeg, .jpg)" : imageName}</Typography>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{py: 1}}
                    >
                        Create Film
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}