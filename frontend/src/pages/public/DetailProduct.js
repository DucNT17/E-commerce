import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts, apiUpdateCart } from 'apis';
import {
  Breadcrumb,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInfo,
  Product
} from 'components'
import Slider from "react-slick";
import { renderStarFromNumber, formatPriceVN } from 'utils/helper';
import { productExtraInfo } from 'utils/contants'
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { getCurrent } from 'store/user/asyncActions';
import { toast } from 'react-toastify';
import withBaseComponent from 'hocs/withBaseComponent';

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

const DetailProduct = ({ isQuickView, data, dispatch, navigate, location }) => {
  const titleRef = useRef()
  const { current } = useSelector(state => state.user);
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [currentImage, setCurrentImage] = useState(null)
  const [update, setUpdate] = useState(false);
  const [varriant, setVarriant] = useState(null);
  const [pid, setPid] = useState(null);
  const [category, setCategory] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    color: '',
    thumb: '',
    images: [],
    price: '',
  })

  useEffect(() => {
    if (data) {
      setPid(data.pid);
      setCategory(data.category);
    } else if (params && params.pid) {
      setPid(params.pid);
      setCategory(params.category);
    }
  }, [data, params])

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
    if (varriant) {
      setCurrentProduct({
        title: product?.varriants?.find(el => el.sku === varriant)?.title,
        color: product?.varriants?.find(el => el.sku === varriant)?.color,
        price: product?.varriants?.find(el => el.sku === varriant)?.price,
        images: product?.varriants?.find(el => el.sku === varriant)?.images,
        thumb: product?.varriants?.find(el => el.sku === varriant)?.thumb,
      })
    } else {
      setCurrentProduct({
        title: product?.title,
        color: product?.color,
        images: product?.images || [],
        price: product?.price,
        thumb: product?.thumb
      })
    }
  }, [varriant])

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
    if (!isQuickView){
      titleRef.current.scrollIntoView({ block: 'center' });
    }
  }, [pid, params.pid]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [update]);


  const handleQuantity = (number) => {
    if (+number > 1) {
      setQuantity(number);
    }
  }

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

  // console.log(product);
  const handleAddToCart = async () => {
    if (!current) {
      return Swal.fire({
        title: 'Almost...',
        text: 'Please login first',
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Not now!',
        confirmButtonText: 'Go login'
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({ redirect: location.pathname }).toString(),
          })
        }
      })
    }
    const response = await apiUpdateCart({
      pid,
      color: currentProduct.color || product?.color,
      quantity,
      price: currentProduct.price || product?.price,
      thumbnail: currentProduct.thumb || product?.thumb,
      title: currentProduct.title || product?.title,
    });
    if (response.success) {
      toast.success(response.mes);
      dispatch(getCurrent())
    } else {
      toast.error(response.mes)
    }
  }
  return (
    <div className={clsx('w-full')}>
      {!isQuickView && <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div ref={titleRef} className='w-main'>
          <h3 className='font-semibold'>{currentProduct?.title || product?.title}</h3>
          <Breadcrumb title={currentProduct?.title || product?.title} category={category} />
        </div>
      </div>}
      <div onClick={e => e.stopPropagation()}
        className={clsx('bg-white m-auto mt-4 flex', isQuickView ? 'max-w-[900px] gap-16 p-8 max-h-[90vh] overflow-y-auto' : 'w-main')}>
        <div className={clsx('flex flex-col gap-4', isQuickView ? 'w-1/2' : 'w-2/5')}>
          <div className='h-[458px] w-[458px] border overflow-hidden flex items-center'>
            <img src={currentProduct?.thumb || currentImage} alt='product-thumb' />
          </div>

          <div className='w-[458px]'>
            <Slider {...settings} className=''>
              {currentProduct?.images.length === 0 && product?.images?.map((el, index) => (
                <div key={index} className='flex w-full gap-2'>
                  <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border object-contain cursor-pointer' />
                </div>
              ))}
              {currentProduct?.images.length > 0 && currentProduct?.images?.map((el, index) => (
                <div key={index} className='flex w-full gap-2'>
                  <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border object-contain cursor-pointer' />
                </div>
              ))}
            </Slider>
          </div>

        </div>
        <div className={clsx('flex flex-col gap-4 pr-[24px]', isQuickView ? 'w-1/2' : 'w-2/5')}>
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold'>{`${formatPriceVN(currentProduct?.price || product?.price)}`}</h2>
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
            {product?.description?.length > 1 && product?.description?.map((el, index) => (
              <li key={index} className='leading-6'>{el}</li>
            ))}
            {product?.description?.length === 1 && <div className='text-sm line-clamp-[10] mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
          </ul>

          <div className='my-4 flex  gap-4'>
            <span className='font-bold'>
              Color:
            </span>
            <div className='flex flex-wrap gap-4 items-center w-full'>
              <div
                onClick={() => setVarriant(null)}
                className={clsx('flex items-center gap-2 p-2 border rounded-md cursor-pointer', !varriant && 'border-main')}
              >
                <img src={product?.thumb} alt='thumb' className='w-8 h-8 object-cover rounded-md ' />
                <span className='flex flex-col'>
                  <span>{product?.color}</span>
                  <span className='text-sm'>{formatPriceVN(product?.price)}</span>
                </span>
              </div>
              {product?.varriants?.map(el => (
                <div
                  onClick={() => setVarriant(el?.sku)}
                  className={clsx('flex items-center gap-2 p-2 border rounded-md cursor-pointer', varriant === el.sku && 'border-main')}
                  key={el.sku}
                >
                  <img src={el?.thumb} alt='thumb' className='w-8 h-8 object-cover rounded-md' />
                  <span className='flex flex-col'>
                    <span>{el?.color}</span>
                    <span className='text-sm'>{formatPriceVN(el?.price)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-4'>
              <span className='font-semibold'>Quantity</span>
              <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity} />
            </div>
            <Button handleOnClick={handleAddToCart} fw>
              ADD TO CART
            </Button>
          </div>
        </div>

        {!isQuickView && <div className='w-1/5'>
          {productExtraInfo?.map(el => (
            <ProductExtraInfoItem
              key={el.id}
              title={el.title}
              icon={el.icon}
              sub={el.sub}
            />
          ))}
        </div>}
      </div>
      {!isQuickView && <div className='w-main m-auto mt-8'>
        <ProductInfo
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
          rerender={rerender}
        />
      </div>}

      {!isQuickView && <div className='w-main m-auto my-6'>
        <h3 className='text-[20px] font-semibold py-[15px] uppercase border-main border-b-2'>OTHER CUSTOMERS ALSO BUY:</h3>
        {/* <CustomSlider products={relatedProducts} normal={true}/> */}
        <Slider {...setting} className='mt-4'>
          {relatedProducts?.map((el, index) => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              // isNew={false}
              normal={true}
            />
          ))}
        </Slider>
      </div>}
    </div>
  )
}

export default withBaseComponent(DetailProduct)