import React from 'react'

const Product = ({ productData }) => {
  return (
    <div className='w-1/3'>
      <img src={productData?.thumb || 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'} 
        alt='' className='w-[243px] h-[243px] object-cover' 
      />
    </div>
  )
}

export default Product