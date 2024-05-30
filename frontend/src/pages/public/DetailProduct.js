import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from '../../apis';
import {
  Breadcrumb,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInfo,
  Product
} from '../../components'
import Slider from "react-slick";
import { formatMoney, formatPrice, renderStarFromNumber } from '../../utils/helper';
import { productExtraInfo } from '../../utils/contants'


const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
};

const setting = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1
};

const DetailProduct = () => {

  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [currentImage, setCurrentImage] = useState(null)
  const [update, setUpdate] = useState(false);
  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) {
      setRelatedProducts(response.products)
    }
  }

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) {
      setProduct(response.productData)
      setCurrentImage(response?.productData.thumb)
    }
  }

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
  }, [pid]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [update]);


  const handleQuantity = useCallback((number) => {
    setQuantity(number);
  }, [quantity]);

  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return;
    if (flag === 'minus') setQuantity(prev => +prev - 1);
    if (flag === 'plus') setQuantity(prev => +prev + 1);
  }, [quantity])

  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImage(el)
  }

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  return (
    <div className='w-full'>
      <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div className='w-main'>
          <h3 className='font-semibold'>{title}</h3>
          <Breadcrumb title={title} category={category} />
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='w-2/5 flex flex-col gap-4'>
          <div className='h-[458px] w-[458px] border overflow-hidden'>
            <img src={currentImage} alt='product-thumb' />
          </div>

          <div className='w-[458px]'>
            <Slider {...settings} className=''>
              {product?.images?.map((el, index) => (
                <div key={index} className='flex w-full gap-2'>
                  <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border object-contain cursor-pointer' />
                </div>
              ))}
            </Slider>
          </div>

        </div>
        <div className='w-2/5 flex flex-col gap-4 pr-[24px]'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(product?.price))} VND`}</h2>
            <span className='text-sm text-main italic'>
              {`In Stock: ${product?.quantity}`}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className='text-sm text-main italic'>{`(Sold: ${product?.sold})`}</span>
          </div>
          <ul className='list-square text-sm text-gray-500 pl-4'>
            {product?.description?.map((el, index) => (
              <li key={index} className='leading-6'>{el}</li>
            ))}
          </ul>
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-4'>
              <span className='font-semibold'>Quantity</span>
              <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity} />
            </div>
            <Button fw>
              ADD TO CART
            </Button>
          </div>
        </div>
        <div className='w-1/5'>
          {productExtraInfo?.map(el => (
            <ProductExtraInfoItem
              key={el.id}
              title={el.title}
              icon={el.icon}
              sub={el.sub}
            />
          ))}
        </div>
      </div>
      <div className='w-main m-auto mt-8'>
        <ProductInfo
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
          rerender={rerender}
        />
      </div>
      <div className='w-main m-auto my-6'>
        <h3 className='text-[20px] font-semibold py-[15px] uppercase border-main border-b-2'>OTHER CUSTOMERS ALSO BUY:</h3>
        {/* <CustomSlider products={relatedProducts} normal={true}/> */}
        <Slider {...setting} className='mt-4'>
          {relatedProducts?.map((el, index) => (
            <Product
              key={index}
              pid={el._id}
              productData={el}
              isNew={false}
              normal={true}
            />
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default DetailProduct