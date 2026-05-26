import axios from 'axios'

const api = axios.create({
    baseURL: 'https://blog-app-backend-i556.onrender.com/api',
    withCredentials: true
})

export default api