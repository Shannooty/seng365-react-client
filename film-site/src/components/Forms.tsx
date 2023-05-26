import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle, FormControl,
    FormHelperText, IconButton,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent, Slider,
    Stack,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import {AddAPhoto, Star, Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {ChangeEvent} from "react";
import {ageRatings, createFilm, createReview, getFilm, getGenres, updateFilm} from "../services/FilmService";
import {useNavigate} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {deepOrange} from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import {editUser, login, logout, register} from "../services/UserService";

export const FilmForm = (params: {open: boolean, setOpen: Function, edit: Boolean, filmId: number}) => {

    const navigate = useNavigate();
    const [genres, setGenres] = React.useState < Array < Genre >> ([]);
    const [selectedGenre, setSelectedGenre] = React.useState('');
    const [selectedAgeRating, setSelectedAgeRating] = React.useState ('TBC');
    const [selectedDate, setSelectedDate] = React.useState(dayjs().add(1,'day'));
    const [imageName, setImageName] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [runtime, setRuntime] = React.useState('');
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
        const date = selectedDate.add(13, 'hours').toISOString().replace("T", " ").split('.')[0]
        let filmResponse;
        if (params.edit) {
            if (image.size > 0 && !allowedFiles.includes(image.type)) {
                console.log(data.get("image"))
                setInvalidImage(true);
                return;
            }
            filmResponse = await updateFilm(data.get('title'), data.get('description'), selectedGenre, date, selectedAgeRating, parseInt(data.get('runtime') as string), image.size > 0 ? image : null, params.filmId);
        } else {
            if (image.size === 0 || !allowedFiles.includes(image.type)) {
                setInvalidImage(true);
                return;
            }
            filmResponse = await createFilm(data.get('title'), data.get('description'), selectedGenre, date, selectedAgeRating, parseInt(data.get('runtime') as string), image);
        }

        setInvalidTitle(false);
        setInvalidDescription(false);
        setInvalidGenre(false);
        setInvalidRuntime(false);

        switch (filmResponse.status) {
            case 200:
                navigate(0);
                handleClose();
                break;
            case 201:
                navigate(`/films/${filmResponse.data.filmId}`);
                handleClose();
                break;
            case 400:
                const statusMessage: string = filmResponse.statusText;

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
            setSelectedDate(day);
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
        if (params.edit) {
            getFilm(params.filmId).then((response) => {
                setSelectedDate(dayjs(response.data.releaseDate));
                setSelectedGenre(response.data.genreId);
                setSelectedAgeRating(response.data.ageRating);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setRuntime(response.data.runtime);
                console.log(selectedDate)
            })
        }

    }, [imageName, params.open])

    return (
        <Dialog
            open={params.open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>{params.edit ? "Edit Film" : "Create Film"}</DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate onSubmit={handleSubmit} py={1} spacing={2}>
                    <TextField
                        error={invalidTitle}
                        defaultValue={title}
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
                        defaultValue={description}
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
                        <DatePicker onChange={handleDate} label={"Release Date"} minDate={dayjs().add(1,'day')} defaultValue={selectedDate}/>
                    </LocalizationProvider>
                    <TextField
                        error={invalidRuntime}
                        defaultValue={runtime}
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
                        {params.edit ? "Update Film" : "Create Film"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export const ReviewDialog = (params: {open: boolean, setOpen: Function, filmId: number}) => {

    const [invalidReview, setInvalidReview] = React.useState(false);
    const [sliderValue, setSliderValue] = React.useState(5);
    function handleClose() {
        params.setOpen(false)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const response = await createReview(sliderValue, params.filmId, data.get("review"))
        console.log(response)

        if (response.status !== 201) {
            setInvalidReview(true);
        } else {
            handleClose()
        }
    }

    function handleSlider(event: Event, newValue: number | number[]) {
        if (typeof newValue === 'number') {
            setSliderValue(newValue);
        }
    }

    return (
        <Dialog
            open={params.open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>Add Review</DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate onSubmit={handleSubmit} py={4} spacing={2}>
                    <FormControl>
                        <Typography id="rating-linear-slider" variant={'h5'}>
                            Rating: {sliderValue} <Star sx={{color: 'gold', fontSize:'25px'}}/>
                        </Typography>
                        <Slider
                            aria-label="Rating"
                            aria-labelledby={"rating-linear-slider"}
                            value={sliderValue}
                            onChange={handleSlider}
                            valueLabelDisplay="auto"
                            step={1}
                            min={1}
                            max={10}
                            marks={true}
                        />
                    </FormControl>

                    <TextField
                        error={invalidReview}
                        name="review"
                        multiline
                        minRows={2}
                        maxRows={5}
                        fullWidth
                        id="review"
                        label="Review"
                        helperText={invalidReview ? 'Review must not have more than 512 chars' : ''}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{py: 1}}
                    >
                        Create
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export const EditProfileForm = (params : {open: boolean, setOpen: Function, user: User}) => {

    const navigate = useNavigate();
    const [invalidFirst, setInvalidFirst] = React.useState(false);
    const [invalidLast, setInvalidLast] = React.useState(false);
    const [invalidEmail, setInvalidEmail] = React.useState(false);
    const [invalidPassword, setInvalidPassword] = React.useState(false);
    const [invalidOldPassword, setInvalidOldPassword] = React.useState(false);
    const [emailInUse, setEmailInUse] = React.useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const allowedFiles = ["image/gif","image/jpeg","image/png","image/jpg"];
    const [invalidImage, setInvalidImage] = React.useState(false);
    const [image, setImage] = React.useState('');

    function handleClose() {
        params.setOpen(false);
    }

    const handlePassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    function handleImage(event: ChangeEvent<HTMLInputElement>) {
        setInvalidImage(false);

        const files = event.target.files
        if (files && files.length > 0) {
            setImage(window.URL.createObjectURL(files[0]))
            if (!allowedFiles.includes(files[0].type)) {
                setInvalidImage(true);
            }
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const image = (data.get("image") as File)
        if (image.size > 0 && !allowedFiles.includes(image.type)) {
            setInvalidImage(true);
            return;
        }
        const registerResponse = await editUser(data.get('email'), data.get('firstName'), data.get('lastName'), data.get('old-password'), data.get('new-password'), image);

        setEmailInUse(false);
        setInvalidFirst(false);
        setInvalidLast(false);
        setInvalidEmail(false);
        setInvalidPassword(false);
        setInvalidOldPassword(false);

        switch (registerResponse.status) {
            case 200:
                handleClose();
                break;
            case 400:
                const statusMessage: string = registerResponse.statusText;
                console.log(statusMessage.toString());

                if (statusMessage.includes("firstName")) {
                    setInvalidFirst(true);
                } else if (statusMessage.includes("lastName")) {
                    setInvalidLast(true);
                } else if (statusMessage.includes("email")) {
                    setInvalidEmail(true);
                } else {
                    setInvalidPassword(true);
                }
                break;
            case 401:
                setInvalidOldPassword(true);
                break;
            case 403:
                setEmailInUse(true);
                break;
            default:
                break;
        }
    }

    return (
        <Dialog
            open={params.open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>Add Review</DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate onSubmit={handleSubmit} py={4} spacing={2}>
                    <Avatar
                        src={image}
                        sx={{ bgcolor: deepOrange[500], width: "60px", height: "60px" }}
                    />
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

                    {invalidImage ? (
                            <Grid item xs={12}>
                                <Typography color='error' variant={'subtitle2'}>Invalid image type, must be (.gif, .png,
                                    .jpeg, .jpg)</Typography>
                            </Grid>)
                        :
                        (<div/>)
                    }

                    <TextField
                        error={invalidFirst}
                        autoComplete="given-name"
                        name="firstName"
                        defaultValue={params.user.firstName}
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        helperText={invalidFirst ? 'First Name must be greater than 1 character' : ''}
                    />

                    <TextField
                        error={invalidLast}
                        defaultValue={params.user.lastName}
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        helperText={invalidLast ? 'Last Name must be greater than 1 character' : ''}
                    />


                    <TextField
                        error={invalidEmail || emailInUse}
                        required
                        fullWidth
                        defaultValue={params.user.email}
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        helperText={invalidEmail ? 'Invalid email' : emailInUse ? 'Email is already in use' : ''}
                    />
                    <TextField
                        error={invalidOldPassword || invalidPassword}
                        required
                        fullWidth
                        name="old-password"
                        label="Old Password"
                        type={passwordVisible ? "text" : "password"}
                        id="old-password"
                        autoComplete="old-password"
                        helperText={invalidOldPassword ? 'Does not match your current password' : invalidPassword ? 'Password must NOT have fewer than 6 characters' : ''}
                        InputProps={{endAdornment:
                                <IconButton onClick={handlePassword}>
                                    {
                                        passwordVisible ? <Visibility/> : <VisibilityOff/>
                                    }
                                </IconButton>
                        }}
                    />
                    <TextField
                        error={invalidPassword}
                        required
                        fullWidth
                        name="new-password"
                        label="New Password"
                        type={passwordVisible ? "text" : "password"}
                        id="new-password"
                        autoComplete="new-password"
                        helperText={invalidPassword ? 'Password must NOT have fewer than 6 characters' : ''}
                        InputProps={{endAdornment:
                                <IconButton onClick={handlePassword}>
                                    {
                                        passwordVisible ? <Visibility/> : <VisibilityOff/>
                                    }
                                </IconButton>
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{py: 1}}
                    >
                        Save Details
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}