import { apiGetBlogs } from 'apis';
import { BlogCard, Breadcrumb, Pagination } from 'components'
import withBaseComponent from 'hocs/withBaseComponent';
import React, { useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css';
import { useParams } from 'react-router-dom';



const Blog = () => {
  const titleRef = useRef();
  const { blog } = useParams();
  const [blogs, setBlogs] = useState(null);
  const fetchBlogs = async () => {
    const response = await apiGetBlogs({ sort: '-createdAt' });
    if (response.success) {
      setBlogs(response)
    }
  }
  
  useEffect(() => {
    fetchBlogs();
    titleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  }, [])

  return (
    <div ref={titleRef} className='w-full'>
      <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>Blogs</h3>
          <Breadcrumb blog={blog} />
        </div>
      </div>
      <div className='mt-8 w-main m-auto'>
          <Masonry
            breakpointCols={3}
            className="flex mx-[-10px]"
            columnClassName="my-masonry-grid_column">
            {blogs?.blogs?.map(el => (
              <BlogCard
                key={el._id}
                bid={el._id}
                data={el}
              />
            ))}
          </Masonry>
      </div>
      <div className='w-main m-auto flex my-4 justify-end py-8'>
        <Pagination
          totalCount={blogs?.counts}
        />
      </div>
    </div>
  )
}

export default withBaseComponent(Blog)