import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../utils/axios'
import useAuthStore from '../store/authStore'
import { toast } from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

const BlogDetailPage = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, isAuthenticated } = useAuthStore()


  const fetchBlog = async () => {

    setLoading(true)
    try {
      // Fetch detail blog
      const response = await api.get(`/blogs/${id}`)
      setBlog(response.data.blog)

    } catch (error) {
      toast.error('Failed to fetch blog')
    } finally {
      setLoading(false)
    }

  }

  const fetchComments = async () => {
    try {
      const response = await api.get(`/blogs/${id}/comments`)
      setComments(response.data.comments)
    } catch (error) {
      setComments([])
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      const response = await api.post(`/blogs/${id}/comments`, { content: comment })
      toast.success('Comment added successfully')
      setComment('')
      fetchComments() // Refresh comments after adding
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan komentar')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/blogs/comments/${commentId}`)
      toast.success('Komentar berhasil dihapus!')
      fetchComments() // refresh list komentar
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus komentar')
    }
  }

  const handleDeleteBlog = async () => {
    try {
      const response = await api.delete(`/blogs/${id}`)
      toast.success('Blog berhasil dihapus!')
      navigate('/') 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog')
    }
  }


  useEffect(() => {
    fetchBlog()
    fetchComments()
  }, [id])


  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )

  if (!blog) return (
    <div className="flex justify-center items-center min-h-screen opacity-50">
      <p className="text-xl">Blog tidak ditemukan</p>
    </div>
  )

  return (
    <div className='container mx-auto px-4 py-8 max-w-3xl'>

      {/* ThumbNail */}
      {blog.thumbnail && (
        <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      )}

      {/* Category */}
      <div className="badge badge-primary mb-2">{blog.category || "General"}</div>

      {/* Title */}
      <h1 className='text-3xl font-bold mb-2'>{blog.title}</h1>

      {/* Subtitle */}
      {blog.subtitle && (
        <p className='text-lg opacity-70 mb-4'>{blog.subtitle}</p>
      )}


      {/* Author + Tanggal */}
      <div className="flex items-center gap-2 text-sm opacity-50 mb-8">
        <span>By {blog.author?.username}</span>
        <span>•</span>
        <span>{new Date(blog.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}</span>
      </div>

      {/* Tombol Edit & Delete — hanya author */}
      {user?.id === blog.author?._id && (
        <div className="flex gap-2 mb-8">
          <Link to={`/blogs/${id}/edit`} className="btn btn-outline btn-sm">
            Edit Blog
          </Link>
          <button
            onClick={handleDeleteBlog}
            className="btn btn-error btn-sm"
          >
            Delete Blog
          </button>
        </div>
      )}

      {/* Content Blocks */}
      <div className="mb-12">
        {blog.content.map((block, index) => (
          <div key={index}>
            {/* Kalau type text */}
            {block.type === 'text' && (
              <p className="mb-4 leading-relaxed">{block.value}</p>
            )}
            {/* Kalau type image */}
            {block.type === 'image' && (
              <img
                src={block.value}
                alt={`content-${index}`}
                className="w-full rounded-xl mb-4"
              />
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="divider"></div>


      {/* Seksi Komentar */}
      <div>
        <h3 className='text-xl font-bold mb-6'>
          Komentar ({comments.length})
        </h3>

        {/* Form tambah komentar — hanya kalau sudah login */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className='mb-8'>
            <textarea
              className="textarea textarea-bordered w-full mb-2"
              placeholder="Tulis komentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Kirim Komentar
            </button>
          </form>
        ) : (
          <p className="opacity-50 mb-8">
            <a href="/login" className="link link-primary">Login</a> untuk menambahkan komentar
          </p>
        )}

        {/* List Komentar */}
        {comments.length === 0 ? (
          <p className="opacity-50">Belum ada komentar</p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((c) => (
              <div key={c._id} className="bg-base-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{c.author?.username}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-50">
                      {new Date(c.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    {/* Tombol hapus — hanya pemilik komentar */}
                    {user?.id === c.author?._id && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="btn btn-ghost btn-xs text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    {console.log('user id:', user?.id)}
                    {console.log('author id:', c.author?._id)}
                  </div>
                </div>
                <p className="text-sm">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  )
}

export default BlogDetailPage