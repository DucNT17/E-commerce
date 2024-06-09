import React, { memo, useState } from 'react'
import { formatPriceVN } from 'utils/helper'
import trendingLabel from 'assets/trending.png'
import newLabel from 'assets/new.png'
import { renderStarFromNumber } from 'utils/helper'
import { SelectOption } from 'components'
import icons from 'utils/icons'
import withBaseComponent from 'hocs/withBaseComponent'
import { showModal } from 'store/app/appSlice'
import { DetailProduct } from 'pages/public'
import { apiUpdateCart } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'utils/path'

const { AiFillEye, FaHeart, BsCartCheckFill, BsFillCartPlusFill } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch }) => {

  const [isShowOption, setIsShowOption] = useState(false);
  const { current } = useSelector(state => state.user)
  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === 'CART') {
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
            navigate(`/${path.LOGIN}`)
          }
        })
      }

      const response = await apiUpdateCart({
        pid: productData._id,
        color: productData.color,
        quantity: 1,
        price: productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title
      });
      
      if (response.success) {
        toast.success(response.mes);
        dispatch(getCurrent())
      } else {
        toast.error(response.mes)
      }
    }
    if (flag === 'WISHLIST') {
      console.log('WISHLIST');
    }
    if (flag === 'QUICK_VIEW') {
      dispatch(showModal({ isShowModal: true, modalChildren: <DetailProduct data={{ pid: productData?._id, category: productData?.category }} isQuickView /> }))
    }
  }
  return (
    <div className='w-full text-base px-[10px]'>
      <div className='w-full border p-[15px] flex flex-col items-center cursor-pointer'
        onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        onMouseEnter={e => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={e => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className='w-full relative'>
          {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-3 animate-slide-top'>
            <span title='Quich view' onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}><SelectOption icon={<AiFillEye />} /></span>
            {current?.cart?.some(el => el.product?._id === productData._id.toString())
              ? <span title='Added to cart'>
                <SelectOption icon={<BsCartCheckFill color='green' />} />
              </span>
              : <span title='Add to cart' onClick={(e) => handleClickOptions(e, 'CART')}>
                <SelectOption icon={<BsFillCartPlusFill />} />
              </span>
            }
            <span title='Add to wishlist' onClick={(e) => handleClickOptions(e, 'WISHLIST')}><SelectOption icon={<FaHeart />} /></span>
          </div>}
          <img src={productData?.thumb || 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'}
            alt='' className='w-[274px] h-[274px] object-cover'
          />
          {!normal && <img src={isNew ? newLabel : trendingLabel} alt='' className='absolute top-0 right-[15px] w-[70px] h-[25px] object-cover' />}
        </div>
        <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
          <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}</span>
          <span className='line-clamp-1'>
            {productData?.title}
          </span>
          <span>
            {`${formatPriceVN(productData?.price)}`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Product))