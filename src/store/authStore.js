import { create } from 'zustand'
import api from '../utils/axios'

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth : true,

    register: async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password })

        return response.data
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })

        set({
            user: response.data.user,
            isAuthenticated: true
        })

        return response.data

    },

    logout: async () => {
        await api.post('/auth/logout')
        set({
            user: null,
            isAuthenticated: false
        })
    },

    checkAuth : async () => {
        try {
            const response =await api.get('/auth/me')
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuth : false
            })
            
        } catch (error) {
            set({
                user: null,
                isAuthenticated : false,
                isCheckingAuth : false
            })
        }
    }

}))

export default useAuthStore