import axios from 'axios'

const createApiClient = () => {
    return axios.create({
        baseURL: 'http://localhost:3000/api/v1',
        responseType: 'json'
    })
}

export const apiClient = createApiClient()