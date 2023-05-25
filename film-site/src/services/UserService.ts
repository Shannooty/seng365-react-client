import apiClient from "../defaults/axios-config"
import {AxiosError} from "axios";

export const login = async (email: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
    try {
        const response = await apiClient.post(`/users/login`, {
            email: email, password: password
        })
        attachTokenToRequest(response.data.token, response.data.userId)
        return 200
    } catch {
        return 401
    }
}

export const logout = async () => {
    attachTokenToRequest();
    try {
        await apiClient.post(`/users/logout`)
        return 200
    } catch {
        return 401
    }
}

export const register = async (firstName: FormDataEntryValue | null, lastName: FormDataEntryValue | null, email: FormDataEntryValue | null, password: FormDataEntryValue | null, image: File) => {
    try {
        const response = await apiClient.post("/users/register", {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password
        })
        await uploadImage(image);
        return response;
    } catch (error: AxiosError | any) {
        return error.response;
    }

}

const attachTokenToRequest = (token = null, userId = null) => {
    localStorage.setItem("userId", userId ? `${userId}` : '');
    localStorage.setItem('X-Authorization', token ? `${token}` : '');
    apiClient.defaults.headers['X-Authorization'] = token ? `${token}` : '';
}

export const isLoggedIn = () => {
    return apiClient.defaults.headers['X-Authorization'];
}

const uploadImage = async (image: File) => {
    try {
        return await apiClient.put(`/users/${localStorage.getItem("userId")}/image`, image, {headers: {
                'Content-Type': image.type}});
    } catch (error: AxiosError | any) {
        return error.response;
    }
}