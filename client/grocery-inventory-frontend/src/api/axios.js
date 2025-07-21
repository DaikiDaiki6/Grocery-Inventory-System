import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5246/api', // .NET API port
    timeout: 10000,
    headers: {
        'Content-Type' : 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export default axiosInstance