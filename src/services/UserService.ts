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
        return await apiClient.put(`/users/${getUserId()}/image`, image, {headers: {
                'Content-Type': image.type}});
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const getUserId = () => {
    return localStorage.getItem('userId');
}

export const getUser = async () => {
    try {
        return await apiClient.get(`/users/${getUserId()}`)
    } catch (error: AxiosError | any) {
        return error.response;
    }
}

export const editUser = async (email: FormDataEntryValue | null, firstName: FormDataEntryValue | null, lastName: FormDataEntryValue | null, password: FormDataEntryValue | null, newPassword: FormDataEntryValue | null, image: File) => {
    try {
        const dataFull = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password : newPassword,
            currentPassword: password
        }
        const smallData = {
            email: email,
            firstName: firstName,
            lastName: lastName,
        }
        const response = await apiClient.patch(`/users/${getUserId()}`, newPassword || password ? dataFull : smallData);
        await uploadImage(image);
        return response;
    } catch (error: AxiosError | any) {
        return error.response;
    }
}