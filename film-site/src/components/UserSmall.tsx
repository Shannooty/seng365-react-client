import {Avatar, Box, Typography} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import React from "react";
import {defaultUser} from "../defaults/defaults";
import apiClient from "../defaults/axios-config";

const UserSmall = (params : {userId: number}) => {
    const userId = params.userId;
    const [user, setUser] = React.useState<User>(defaultUser);

    const getUser = () => {
        apiClient.get(`/users/${userId}`)
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
                src={apiClient.defaults.baseURL + "/users/" + userId + "/image"}
                alt={user.firstName}
            />
            <Typography variant={'h5'}>
                {user.firstName + " " + user.lastName}
            </Typography>
        </Box>
    )
}

export {UserSmall}