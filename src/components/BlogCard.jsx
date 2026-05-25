import React from 'react'
import { Link } from 'react-router-dom'

const BlogCard = ({ blog }) => {
    return (
        <div className='card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300'>

            {/* Thumbnail */}
            <figure>
                <img src={blog.thumbnail || 'https://placehold.co/600x400'} alt={blog.title} className='w-full h-48 object-cover' />
            </figure>


            <div className="card-body">

                {/* Category */}
                <div className="badge badge-primary">
                    {blog.category || "General"}
                </div>

                {/* Title */}
                <h2 className="card-title">{blog.title}</h2>

                {/* Subtitle */}
                <p className="text-sm opacity-70 line-clamp-2">{blog.subtitle}</p>

                {/* Author + Tanggal */}
                <div className="flex items-center justify-between text-xs opacity-50 mt-2">
                    <span>By {blog.author?.username}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}</span>
                </div>

                  {/* Read More */}
                <div className="card-actions justify-end mt-4">
                    <Link to={`/blogs/${blog._id}`} className="btn btn-primary btn-sm">
                        Read More
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default BlogCard