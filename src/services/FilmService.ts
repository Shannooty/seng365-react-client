import apiClient from "../defaults/axios-config";
import {AxiosError} from "axios";

export const ageRatings = ["G", "PG", "M", "R13", "R16", "R18", "TBC"]

const uploadImage = async (image: File, filmId: number) => {
    try {
        return await apiClient.put(`/films/${filmId}/image`, image, {headers: {
                'Content-Type': image.type}});
    } catch (error: AxiosError | any) {
        return error.response;
    }
}
export const getGenres = async () => {

    try {
        const response = await apiClient.get('/films/genres');
        return response.data;
    } catch {
        return 500
    }
}

export const getGenre = async (film : Film) => {
    const genres = await getGenres();
    return genres.filter((genre: Genre) => genre.genreId === film.genreId)[0]
}

export const createFilm = async (title: FormDataEntryValue | null, description: FormDataEntryValue | null, genre: string, releaseDate: string, rating: string, runtime: number, image: File) => {
    try {
        const response = await apiClient.post("/films", {
            title: title,
            description: description,
            genreId: genre,
            releaseDate: releaseDate,
            runtime: runtime,
            ageRating: rating
        })
        const imageres = await uploadImage(image, response.data.filmId);
        if (imageres.status !== 200 && imageres.status !== 201) {
            return imageres;
        }
        return response;
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const updateFilm = async (title: FormDataEntryValue | null, description: FormDataEntryValue | null, genre: string, releaseDate: string, rating: string, runtime: number, image: FormDataEntryValue | null, filmId: number) => {
    try {
        const response = await apiClient.patch("/films/" + filmId, {
            title: title,
            description: description,
            genreId: genre,
            releaseDate: releaseDate,
            runtime: runtime,
            ageRating: rating
        })
        if (image) {
            const imageres = await uploadImage(image as File, filmId);
            if (imageres.status !== 200 && imageres.status !== 201) {
                return imageres;
            }
        }
        return response;
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const getFilm = async (filmId: number | string | undefined) => {
    try {
        return await apiClient.get(`/films/${filmId}`);
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const deleteFilm = async (filmId: number | string | undefined) => {
    try {
        return await apiClient.delete(`/films/${filmId}`);
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const getFilms = async (params = '') => {
    try {
        return await apiClient.get(`/films?${params}`);
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const createReview = async (rating: number, filmId: number, review?: FormDataEntryValue | null) => {
    try {
        return await apiClient.post(`/films/${filmId}/reviews`, {
            rating: rating,
            review: review,
        });
    } catch (error: AxiosError | any) {
        return error.response;
    }
}