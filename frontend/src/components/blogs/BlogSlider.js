import React, { memo } from 'react'
import Slider from 'react-slick';
import BlogCard from './BlogCard';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const BlogSlider = ({ blogs }) => {
    return (
        <div>
            <Slider {...settings}>
                {blogs?.map((el, index) => (
                    <BlogCard 
                        key={index}
                        bid={el._id}
                        data={el}
                    />
                ))}
            </Slider>
        </div>
    )
}

export default memo(BlogSlider)