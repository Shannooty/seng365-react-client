import {Avatar, Box, ButtonBase, Collapse, Divider, Grid, List, ListItem, Paper, Typography} from "@mui/material";
import {BASE_URL} from "../index";
import React, {useState} from "react";
import {UserSmall} from "./UserSmall";
import {ExpandLess, ExpandMore, Star} from "@mui/icons-material";
import axios from "axios";


export const ReviewList = (params : {filmId: number, errorFlag: boolean, setErrorFlag: (arg0: boolean) => void}) => {

    const url = BASE_URL + "/films/" + params.filmId;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewOpen, setReviewOpen] = React.useState(false);
    const [errorFlag, setErrorFlag] = useState(false);

    const getReviews = () => {
        axios.get(url + "/reviews")
            .then((response) => {
                setErrorFlag(false)
                setReviews(response.data)
            }, () => {
                setErrorFlag(true)
            })
    }
    const handleReviews = () => {
        setReviewOpen(!reviewOpen);
    }

    React.useEffect(() => {
        getReviews()
    }, [errorFlag])

    return (
        <Box>
            <Box sx={{bgcolor: "bgPrimary.main"}} display={'flex'} py={3} flexWrap={'wrap'} alignItems={'center'} alignContent={'flex-end'}>
                <ButtonBase disableRipple onClick={handleReviews}>
                    <Typography mx={2} variant={'h4'}>
                        {"Reviews (" + reviews.length + ")"}
                    </Typography>
                    {reviewOpen ? <ExpandLess sx={{fontSize: '30px'}}/> : <ExpandMore sx={{fontSize: '30px'}}/>}
                </ButtonBase>
            </Box>
            <Collapse sx={{bgcolor: "bgPrimary.main"}} in={reviewOpen} timeout="auto" unmountOnExit>
                {reviews.map((review: Review) => {
                    return(<SingleReview review={review}/>)
                })}
            </Collapse>
        </Box>
    )
}
export const SingleReview = (params: {review: Review}) => {
    const review = params.review
    return (
        <Paper elevation={1} sx={{m: 3}}>
            <List>
                <Box display={"flex"} mx={2} alignItems={'center'} justifyContent="space-between">
                    <UserSmall userId={review.reviewerId}/>

                    <Typography color={"primary"} variant={'h4'}>
                        {review.rating}
                        <Star sx={{color: 'gold', fontSize:'35px'}}/>
                    </Typography>

                </Box>
                {review.review ? (<Typography variant={'h5'} sx={{py: 2}}>
                                        {review.review}
                                    </Typography>) : ""}
            </List>
        </Paper>
    )
}