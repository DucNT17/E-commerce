import { apiGetDetailBlog } from 'apis';
import { Breadcrumb } from 'components'
import DOMPurify from 'dompurify';
import withBaseComponent from 'hocs/withBaseComponent'
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";


const DetailBlog = ({ data, dispatch, navigate, location }) => {
    const titleRef = useRef()
    const params = useParams();
    const [detailBlog, setDetailBlog] = useState(null)
    const [pid, setPid] = useState(null);

    useEffect(() => {
        if (data) {
            setPid(data.pid);
        } else if (params && params.pid) {
            setPid(params.pid);
        }
    }, [data, params])

    const fetchBlogData = async () => {
        const response = await apiGetDetailBlog(pid);
        if (response.success) {
            setDetailBlog(response.blog)
        }
    }
    console.log(detailBlog);
    useEffect(() => {
        if (pid) {
            fetchBlogData()
        }
        window.scrollTo(0, 0);
        titleRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
        });
    }, [pid, params.pid])



    return (
        <div className='w-full'>
            <div ref={titleRef} className='h-[81px] bg-gray-100 flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold'>{detailBlog?.title}</h3>
                    <Breadcrumb title={detailBlog?.title} />
                </div>
            </div>
            <div className='w-main mx-auto bg-white mt-4 flex'>
                <div className='flex flex-col text-sm text-gray-700 gap-4'>
                    <div className='flex uppercase gap-8'>
                        <span>
                            {`By ${detailBlog?.author}`}
                        </span>
                        <span>
                            {moment(detailBlog?.createdAt).format('DD/MM/YYYY')}
                        </span>
                        <span>
                            {`${detailBlog?.numberViews} viewed`}
                        </span>
                    </div>
                    <div className='w-full'>
                        <img src={detailBlog?.thumb} alt='thumb' className='w-[1220px] h-[700px] object-cover' />
                    </div>
                    <div className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detailBlog?.description[0]) }}></div>
                </div>
            </div>
            <div className='w-main mx-auto flex justify-between py-4'>
                <div></div>
                <div onClick={e => navigate('/blogs')}
                    className='flex items-center gap-1 text-gray-700 hover:text-main cursor-pointer'>
                    <FaArrowLeftLong />
                    <span className='uppercase text-sm'>
                        back to blog
                    </span>
                </div>

            </div>

        </div>
    )
}

export default withBaseComponent(DetailBlog)