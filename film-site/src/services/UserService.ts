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

export const logout = async () => {
    try {
        await apiClient.post(`/users/logout`)
        attachTokenToRequest();
        return 200
    } catch {
        return 401
    }
}
const attachTokenToRequest = (token = null, userId = null) => {
    apiClient.defaults.headers['X-Authorization'] = token ? `${token}` : '';
    localStorage.setItem("userId", userId ? `${userId}` : '');
}

export const isLoggedIn = () => {
    console.log(apiClient.defaults.headers['X-Authorization'])
    return apiClient.defaults.headers['X-Authorization'] !== '';
}