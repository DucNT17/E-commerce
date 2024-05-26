import React from 'react'
import {
  Sidebar,
  Banner,
  BestSeller,
  DealDaily,
  FeatureProduct,
  NewArrival,
  HotCollections,
  BlogPosts
} from '../../components'


const Home = () => {

  return (
    <>
      <div className='w-main flex mt-6'>
        <div className='flex flex-col gap-5 w-[25%] flex-auto'>
          <Sidebar />
          <DealDaily />
        </div>
        <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto'>
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className='my-4 w-main'>
        <FeatureProduct />
      </div>
      <div className='my-4 w-main'>
        <NewArrival />
      </div>
      <div className='my-4 w-main'>
        <HotCollections />
      </div>
      <div className='my-4 w-main'>
        <BlogPosts />
      </div>
      <div className='w-main h-[500px]'>

      </div>
    </>

  )
}

export default Home