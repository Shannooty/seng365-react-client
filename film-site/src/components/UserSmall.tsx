import {Avatar, Box, Typography} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import {BASE_URL} from "../index";
import React from "react";
import axios from "axios";
import {defaultUser} from "../defaults/defaults";

const UserSmall = (params : {userId: number}) => {
    const userId = params.userId;
    const [user, setUser] = React.useState<User>(defaultUser);

    const getUser = () => {
        axios.get(BASE_URL + `/users/${userId}`)
            .then((response) => {
                setUser(response.data)
            }, () => {})
    }

    React.useEffect(() => {
        getUser()
    }, [])


    return (
        <Box sx={{ display: 'flex', gap: 3, alignItems:"center"}}>
            <Avatar
                sx={{ bgcolor: deepOrange[500], width: "60px", height: "60px" }}
                src={BASE_URL + "/users/" + userId + "/image"}
                alt={user.firstName}
            />
            <Typography variant={'h5'}>
                {user.firstName + " " + user.lastName}
            </Typography>
        </Box>
    )
}

export {UserSmall}