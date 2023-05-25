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