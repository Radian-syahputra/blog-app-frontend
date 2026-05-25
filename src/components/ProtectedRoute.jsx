import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, isCheckingAuth } = useAuthStore()

    if (isCheckingAuth) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    )

    if (!isAuthenticated) return <Navigate to="/login" />
    if (user.role !== 'creator') return <Navigate to="/" />

    return children
}

export default ProtectedRoute