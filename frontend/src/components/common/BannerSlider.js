import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo } from 'react'
import Slider from 'react-slick';

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

const BannerSlider = ({ banners, navigate }) => {
    return (
        <Slider {...settings}>
            {banners?.map((el, index) => (
                <div className='w-full relative'>
                    <span className='absolute flex flex-col right-0 left-0 justify-center top-0 bottom-0 items-center '>
                        <span className='text-3xl font-semibold text-white uppercase'>{el?.title}</span>
                        <button
                        onClick={e => navigate('/products')}
                            type='button'
                            className='flex gap-2 px-4 py-2 items-center justify-center bg-main hover:bg-gray-500 text-white font-medium text-sm'>
                            Shop now
                        </button>
                    </span>
                    <img src={el.thumb} key={index} alt='img' className='h-[420px] w-full object-cover' />

                </div>
            ))}
        </Slider>
    )
}

export default withBaseComponent(memo(BannerSlider))