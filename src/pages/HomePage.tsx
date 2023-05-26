import {Container, Typography} from "@mui/material";
import React from "react";


export  const HomePage = () => {

    React.useEffect(() => {
        document.title = `eMDB Home`;
    }, []);

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Typography variant={'h1'}>Welcome!</Typography>
        </Container>
    )
}