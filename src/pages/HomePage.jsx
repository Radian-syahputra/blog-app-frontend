import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import api from '../utils/axios'

const HomePage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await api.get('/blogs', {
        params: {
          search: search,
          category: category
        }
      })
      setBlogs(response.data.blogs)

    } catch (error) {
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch saat pertama kali buka dan saat search/category berubah
  useEffect(() => {
    fetchBlogs()
  }, [search, category])

  return (
    <div className='container mx-auto px-4 py-8'>

      {/* Search and Category Filters */}
      <div className="flex gap-4 mb-8">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <Search className='opacity-70' size={16} />
          <input type="text" placeholder="Search blogs..." className='grow' value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>

        <select className='select select-bordered' value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Semua Category</option>
          <option value="general">General</option>
          <option value="matematika">Matematika</option>
          <option value="computer">Computer</option>
          <option value="programming">Programming</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <p className="text-xl">Tidak ada blog ditemukan</p>
        </div>
      )}

      {/* Grid Blog */}
      {!loading && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

    </div>
  )
}

export default HomePage