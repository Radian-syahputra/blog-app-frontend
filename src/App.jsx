import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BlogDetailPage from './pages/BlogDetailPage'
import CreateBlogPage from './pages/CreateBlogPage'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import useAuthStore from './store/authStore'
import EditBlog from './pages/EditBlog'
import ProtectedRoute from './components/ProtectedRoute'


const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (isCheckingAuth) return (
    <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
    </div>
)

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/blogs/:id' element={<BlogDetailPage />} />


        <Route path='/create' element={
          <ProtectedRoute>
            <CreateBlogPage />
          </ProtectedRoute>
        } />
        <Route path='/blogs/:id/edit' element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App