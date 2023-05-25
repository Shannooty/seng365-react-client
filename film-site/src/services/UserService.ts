import apiClient from "./axios-config"

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

const attachTokenToRequest = (token = null, userId = null) => {
    apiClient.defaults.headers['Authorization'] = token ? `Bearer ${token}` : '';
    apiClient.defaults.headers['UserId'] = userId ? `Bearer ${userId}` : '';
}

export const isLoggedIn = () => {
    return apiClient.defaults.headers['UserId'];
}