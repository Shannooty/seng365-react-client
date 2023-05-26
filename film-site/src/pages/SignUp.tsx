import * as React from 'react';
import {ChangeEvent} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {isLoggedIn, login, register} from "../services/UserService";
import {IconButton} from "@mui/material";
import {AddAPhoto, Visibility, VisibilityOff} from "@mui/icons-material";
import {deepOrange} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";

export default function SignUp(params : {setOpenLogin: Function}) {

    const navigate = useNavigate();
    const [invalidFirst, setInvalidFirst] = React.useState(false);
    const [invalidLast, setInvalidLast] = React.useState(false);
    const [invalidEmail, setInvalidEmail] = React.useState(false);
    const [invalidPassword, setInvalidPassword] = React.useState(false);
    const [emailInUse, setEmailInUse] = React.useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const allowedFiles = ["image/gif","image/jpeg","image/png","image/jpg"];
    const [invalidImage, setInvalidImage] = React.useState(false);
    const [image, setImage] = React.useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const image = (data.get("image") as File)
        if (image.size > 0 && !allowedFiles.includes(image.type)) {
            setInvalidImage(true);
            return;
        }
        const registerResponse = await register(data.get('firstName'), data.get('lastName'), data.get('email'),  data.get('password'), image);

        setEmailInUse(false);
        setInvalidFirst(false);
        setInvalidLast(false);
        setInvalidEmail(false);
        setInvalidPassword(false);

        switch (registerResponse.status) {
            case 201:
                await login(data.get('email'),  data.get('password'));
                window.location.href = '/';
                break;
            case 400:
                const statusMessage: string = registerResponse.statusText;

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
            case 403:
                setEmailInUse(true);
                break;
            default:
                break;
        }
    };

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

    React.useEffect(() =>{
        if (isLoggedIn()) {
            navigate(0);
        }
    }, [image, invalidImage])

    React.useEffect(() => {
        document.title = 'Register';
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid display={'inline-flex'} justifyContent={'space-evenly'} item py={1} xs={12}>
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
                        </Grid>
                        {invalidImage ? (
                            <Grid item xs={12}>
                            <Typography color='error' variant={'subtitle2'}>Invalid image type, must be (.gif, .png,
                                .jpeg, .jpg)</Typography>
                            </Grid>)
                        :
                            (<div/>)
                        }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={invalidFirst}
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                helperText={invalidFirst ? 'First Name must be greater than 1 character' : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={invalidLast}
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                helperText={invalidLast ? 'Last Name must be greater than 1 character' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={invalidEmail || emailInUse}
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                helperText={invalidEmail ? 'Invalid email' : emailInUse ? 'Email is already in use' : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={invalidPassword}
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={passwordVisible ? "text" : "password"}
                                id="password"
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
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={() => {params.setOpenLogin(true)}}>
                                Already have an account? Sign in
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}