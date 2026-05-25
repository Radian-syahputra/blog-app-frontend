import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, PenSquare, LogOut } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [theme, setTheme] = useState('forest')
    const { user, isAuthenticated, logout } = useAuthStore()
    const navigate = useNavigate()

    // Apply theme ke html tag
    useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'forest' ? 'cupcake' : 'forest')
    }

    const handleLogout = async () => {
        try {
            await logout()
            toast.success('Logout berhasil!')
            navigate('/login')
        } catch (error) {
            toast.error('Gagal logout')
        }
    }

    return (
        <nav className="navbar bg-base-200 shadow-md px-4">

            {/* Kiri — Logo + Home */}
            <div className="navbar-start gap-2">
                <Link to="/" className="btn btn-ghost text-xl font-bold">
                    J-Blog
                </Link>
                <Link to="/" className="btn btn-ghost">
                    Home
                </Link>
            </div>

            {/* Tengah — kosong */}
            <div className="navbar-center"></div>

            {/* Kanan */}
            <div className="navbar-end gap-2">

                {/* Toggle Theme */}
                <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                    {theme === 'forest' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Belum login */}
                {!isAuthenticated && (
                    <>
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm">
                            Register
                        </Link>
                    </>
                )}

                {/* Sudah login */}
                {isAuthenticated && (
                    <>
                        <span className="text-sm font-semibold hidden md:block">
                            {user?.username}
                        </span>

                        {/* Hanya creator */}
                        {user?.role === 'creator' && (
                            <Link to="/create" className="btn btn-primary btn-sm gap-1">
                                <PenSquare size={14} />
                                Create Blog
                            </Link>
                        )}

                        <button onClick={handleLogout} className="btn btn-ghost btn-sm gap-1">
                            <LogOut size={14} />
                            Logout
                        </button>
                    </>
                )}

            </div>
        </nav>
    )
}

export default Navbar