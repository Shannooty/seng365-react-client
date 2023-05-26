import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {getUser, getUserId, isLoggedIn, logout} from "../services/UserService";
import {defaultUser} from "../defaults/defaults";
import {useNavigate} from "react-router-dom";
import {deepOrange} from "@mui/material/colors";
import apiClient from "../defaults/axios-config";
import {Button, Stack} from "@mui/material";
import {EditProfileForm} from "../components/Forms";

export const ProfilePage = () => {

    const navigate = useNavigate();
    const [user, setUser] = React.useState<User>(defaultUser);
    const [openEditForm, setOpenEditForm] = React.useState(false)

    const findUser = async () => {
        const response = await getUser();
        if (response.status === 200) {
            setUser(response.data)
        } else if (response.status === 404) {
            await logout();
            navigate("/");
        }
    }

    React.useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/');
        } else {
            findUser();
        }
    }, [openEditForm])

    function handleEditButton() {
        setOpenEditForm(true);
    }

    React.useEffect(() => {
        document.title = `${user.firstName}'s Profile`;
    }, [user]);

    return (
        <Container component="main" maxWidth="xs">
            <Stack spacing={2}
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar
                    sx={{ bgcolor: deepOrange[500], width: "120px", height: "120px" }}
                    src={apiClient.defaults.baseURL + "/users/" + getUserId() + "/image"}
                    alt={user.firstName}
                />
                <Typography component="h1" variant="h3">
                    {user.firstName + " " + user.lastName}
                </Typography>
                <Typography component="h1" variant="h4">
                    {user.email}
                </Typography>
                <Button variant={'contained'} onClick={handleEditButton}>Edit Profile</Button>
                <EditProfileForm open={openEditForm} setOpen={setOpenEditForm} user={user}/>
            </Stack>
        </Container>
    )
}