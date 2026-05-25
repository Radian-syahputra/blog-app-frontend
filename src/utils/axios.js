import axios from 'axios'

const api = axios.create({
    baseURL: 'https://blog-app-backend-production-ed90.up.railway.app/api',
    withCredentials: true
})

export default api