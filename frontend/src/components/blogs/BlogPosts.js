import { apiGetBlogs } from 'apis'
import React, { memo, useEffect, useState } from 'react'
import BlogSlider from './BlogSlider'


const BlogPosts = () => {
  const [blogs, setBlogs] = useState(null)
  const fetchBlogs = async () => {
    const response = await apiGetBlogs({ sort: '-createdAt' });
    if (response.success) {
      setBlogs(response.blogs)
    }
  }
  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className='w-full'>
      <h3 className='text-[20px] font-semibold py-[15px] uppercase border-main border-b-2'>blog posts</h3>
      <div className='mt-4 mx-[-10px]'>
        <BlogSlider blogs={blogs}/>
      </div>
    </div>
  )
}

export default memo(BlogPosts)