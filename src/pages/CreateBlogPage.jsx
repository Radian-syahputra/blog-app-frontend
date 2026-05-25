import { ImagePlus, Trash2, Type } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'

const CreateBlogPage = () => {

  const navigate = useNavigate()

  // State untuk form input
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)

  // State untuk menyimpan konten dinamis (text dan image)
  const [content, setContent] = useState([])

  // Fungsi untuk menambahkan blok teks baru
  const addTextBlock = () => {
    setContent([...content, { type: 'text', value: '' }])
  }

  // Fungsi untuk menambahkan blok gambar baru
  const addImageBlock = () => {
    setContent([...content, { type: 'image', value: null }])
  }


  // Update nilai block berdasarkan index
  const updateBlock = (index, value) => {
    const updatedContent = [...content]
    updatedContent[index].value = value
    setContent(updatedContent)
  }

  // Hapus block berdasarkan index
  const removeBlock = (index) => {
    const updatedContent = content.filter((_, i) => i !== index)
    setContent(updatedContent)
  }

  // Konversi file image ke base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title) return toast.error('Title is required')
    if (content.length === 0) return toast.error('Content cannot be empty')

    setLoading(true)
    try {
      // Proses content blocks — konversi image file ke base64
      const processedContent = await Promise.all(content.map(async (block) => {
        if (block.type === 'image' && block.value) {
          const base64 = await toBase64(block.value)
          return { type: 'image', value: base64 }
        }
        return block
      }))

      // Format data untuk API
      const formData = new FormData()
      formData.append('title', title)
      formData.append('subtitle', subtitle)
      formData.append('category', category || 'general')
      formData.append('content', JSON.stringify(processedContent))


      // Kalau ada thumbnail
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      await api.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Blog berhasil dibuat!')
      navigate('/')

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create Blog</h1>

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            placeholder="Judul blog..."
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Subtitle</span>
          </label>
          <input
            type="text"
            placeholder="Subtitle blog..."
            className="input input-bordered w-full"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: programming, matematika..."
            className="input input-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Thumbnail */}
        <div className="form-control mb-8">
          <label className="label">
            <span className="label-text">Thumbnail</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        {/* Content Blocks */}
        <div className="mb-6">
          <label className="label">
            <span className="label-text font-bold text-lg">Content</span>
          </label>

          {content.length === 0 && (
            <p className="opacity-50 text-sm mb-4">Belum ada content, tambahkan block di bawah!</p>
          )}

          {content.map((block, index) => (
            <div key={index} className="bg-base-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-50 uppercase font-bold">
                  {block.type}
                </span>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Text Block */}
              {block.type === 'text' && (
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Tulis konten..."
                  rows={4}
                  value={block.value}
                  onChange={(e) => updateBlock(index, e.target.value)}
                />
              )}

              {/* Image Block */}
              {block.type === 'image' && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => updateBlock(index, e.target.files[0])}
                  />
                  {/* Preview image */}
                  {block.value && (
                    <img
                      src={URL.createObjectURL(block.value)}
                      alt="preview"
                      className="mt-2 w-full rounded-xl max-h-48 object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tombol tambah block */}
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={addTextBlock}
            className="btn btn-outline btn-sm gap-1"
          >
            <Type size={14} />
            + Text
          </button>
          <button
            type="button"
            onClick={addImageBlock}
            className="btn btn-outline btn-sm gap-1"
          >
            <ImagePlus size={14} />
            + Image
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Publish Blog'}
        </button>

      </form>
    </div>
  )
}

export default CreateBlogPage