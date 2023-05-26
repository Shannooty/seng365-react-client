import {Box, Button, ButtonBase, Collapse, Divider, List, Paper, Typography} from "@mui/material";
import React, {useState} from "react";
import {UserSmall} from "./UserSmall";
import {Add, ExpandLess, ExpandMore, Star} from "@mui/icons-material";
import apiClient from "../defaults/axios-config";
import {getUserId, isLoggedIn} from "../services/UserService";
import {ReviewDialog} from "./Forms";
import dayjs from "dayjs";


export const ReviewList = (params : {film: Film, errorFlag: boolean, setErrorFlag: Function, setLoginOpen: Function}) => {

    const url = "/films/" + params.film.filmId;
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewOpen, setReviewOpen] = React.useState(false);
    const [errorFlag, setErrorFlag] = useState(false);
    const [openNewReview, setOpenNewReview] = useState(false);

    const getReviews = () => {
        apiClient.get(url + "/reviews")
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
    }, [errorFlag, openNewReview, params.film])

    function handleReviewAdd() {
        if (!isLoggedIn()) {
            params.setLoginOpen(true)
            return;
        }
        setOpenNewReview(true);
    }

    const userHasReview = (userId: string) => {
        const userIdsReviewed = reviews.filter((review: Review) => {return review.reviewerId === parseInt(userId)})
        return userIdsReviewed.length > 0;
    }

    return (
        <Box>
            <Box sx={{bgcolor: "bgPrimary.main"}} display={'flex'} py={3} flexWrap={'wrap'} alignItems={'center'}>
                <Box mx={2} display={'flex'} width={"100%"} justifyContent={'space-between'}>
                    <ButtonBase disableRipple onClick={handleReviews}>
                        <Typography variant={'h4'}>
                            {"Reviews (" + reviews.length + ")"}
                        </Typography>
                        {reviewOpen ? <ExpandLess sx={{fontSize: '30px'}}/> : <ExpandMore sx={{fontSize: '30px'}}/>}
                    </ButtonBase>
                    {
                        params.film.directorId === parseInt(getUserId() as string) || dayjs(params.film.releaseDate) > dayjs() || userHasReview(getUserId() as string) ?
                            (<></>)
                            :
                            (
                            <><Button variant={'contained'} onClick={handleReviewAdd} endIcon={<Add/>}>
                                Add Review
                            </Button><ReviewDialog open={openNewReview} setOpen={setOpenNewReview} filmId={params.film.filmId}/></>
                        )
                    }
                </Box>
            </Box>
            <Collapse sx={{bgcolor: "bgPrimary.main"}} in={reviewOpen} timeout="auto" unmountOnExit>
                {reviews.map((review: Review) => {
                    return(<SingleReview key={review.reviewerId} review={review}/>)
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
                {review.review ? (<><Divider sx={{py: 1}} orientation={'horizontal'}/><Typography variant={'h5'} sx={{py: 2}}>
                    {review.review}
                </Typography></>) : ""}
            </List>
        </Paper>
    )
}