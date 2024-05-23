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
      <div className='w-main flex'>
        <div className='flex flex-col gap-5 w-[25%] flex-auto'>
          <Sidebar />
          <DealDaily />
        </div>
        <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto'>
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className='my-4'>
        <FeatureProduct />
      </div>
      <div className='my-4 w-full'>
        <NewArrival />
      </div>
      <div className='my-4 w-full'>
        <HotCollections />
      </div>
      <div className='my-4 w-full'>
        <BlogPosts />
      </div>
      <div className='w-full h-[500px]'>
        
      </div>
    </>

  )
}

export default Home