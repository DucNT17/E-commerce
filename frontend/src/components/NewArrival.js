import React from 'react'
import Slider from 'react-slick'
import { Product } from './'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const NewArrival = () => {
    return (
        <div className='w-full'>
            <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase'>NEW ARRIVALS</h3>
            {/* <Slider {...settings}>
                {products?.map(el => (
                    <Product
                        key={el.id}
                        pid={el.id}
                        productData={el}
                        isNew={activedTab === 1 ? false : true}
                    />
                ))}
            </Slider> */}
        </div>
    )
}

export default NewArrival