import React, { memo, useEffect, useState } from 'react'
// import banner from 'assets/logo1.png'
import { apiGetBanner } from 'apis'
import { BannerSlider } from 'components'

const Banner = () => {
  const [banners, setBanners] = useState(null)
  const fetchBanner = async () => {
    const response = await apiGetBanner({limit: 3, sort: '-createdAt' });
    if (response.success) {
      setBanners(response.banners);
    }
  }
  useEffect(() => {
    fetchBanner();
  }, [])

  return (
    <div className='w-full'>
      <BannerSlider banners={banners}/>
      {/* <img src={banner} alt='banner' className='h-[420px] w-full object-cover' /> */}
    </div>
  )
}

export default memo(Banner)