import axios from 'axios'

const baseURL = 'http://localhost:4000/api/v1'

const createApiClient = () => {
    return axios.create({
        baseURL: baseURL,
        responseType: 'json'
    })
}

export const apiClient = createApiClient()