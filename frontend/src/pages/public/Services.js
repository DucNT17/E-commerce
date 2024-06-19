import { Breadcrumb } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'

const Services = ({ location }) => {
  return (
    <div className='w-full'>
      <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>Services</h3>
          <Breadcrumb category={location?.pathname?.replace('/', '')?.split('-')?.join(' ')} />
        </div>
      </div>
      <div className='w-main mx-auto flex flex-col my-8'>
        <div className='flex justify-center gap-4 pb-8'>
          <img className='flex-1'
          src='https://cdn.shopify.com/s/files/1/1636/8779/files/9069783_orig.jpg?v=1491836163' alt='img' />
          <span className='text-gray-700 text-sm flex-1'>
            Welcome to Digital Store, your one-stop online shop for all your electronic needs. We offer a vast selection of the latest gadgets, including smartphones, laptops, tablets, and home appliances from top brands.
            <br />
            Our user-friendly website ensures a seamless shopping experience, with detailed product descriptions and customer reviews to help you make informed decisions.
            <br />
            Enjoy competitive prices, secure payment options, and fast shipping to your doorstep. Our dedicated customer support team is available 24/7 to assist you with any inquiries. Shop with confidence at Digital Store and stay ahead with cutting-edge technology.
          </span>
        </div>
        <div>
          <h3 className='flex justify-center py-8 text-3xl font-semibold text-gray-700'>We Offer Best Services</h3>
          <div className='flex flex-col'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col items-center m-8'>
                <img className='pb-4'
                  src='https://cdn.shopify.com/s/files/1/1636/8779/files/settings.png?v=1491835711' alt='setting'
                />
                <span className='text-gray-700 flex flex-col text-center gap-2'>
                  <span className='text-base'>
                    Customizable Page
                  </span>
                  <span className='text-xs'>
                    Fusce arcu molestie eget libetro consectetur congue consectetur in bibendum litora
                  </span>
                </span>
              </div>
              <div className='flex flex-col items-center m-8'>
                <img className='pb-4'
                  src='https://cdn.shopify.com/s/files/1/1636/8779/files/picture.png?v=1491835656' alt='page'
                />
                <span className='text-gray-700 flex flex-col text-center gap-2'>
                  <span className='text-base'>
                    Revolution Slider
                  </span>
                  <span className='text-xs'>
                    Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora
                  </span>
                </span>
              </div>
              <div className='flex flex-col items-center m-8'>
                <img className='pb-4' src='https://cdn.shopify.com/s/files/1/1636/8779/files/layout.png?v=1491835677' alt='setting' />
                <span className='text-gray-700 flex flex-col text-center gap-2'>
                  <span className='text-base'>
                    Drag & Drop Page
                  </span>
                  <span className='text-xs'>
                    Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora
                  </span>
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col items-center m-8'>
                <img className='pb-4'
                  src='https://cdn.shopify.com/s/files/1/1636/8779/files/picture.png?v=1491835656' alt='page'
                />
                <span className='text-gray-700 flex flex-col text-center gap-2'>
                  <span className='text-base'>
                    Revolution Slider
                  </span>
                  <span className='text-xs'>
                    Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora
                  </span>
                </span>
              </div>
              <div className='flex flex-col items-center m-8'>
                <img className='pb-4' src='https://cdn.shopify.com/s/files/1/1636/8779/files/layout.png?v=1491835677' alt='setting' />
                <span className='text-gray-700 flex flex-col text-center gap-2'>
                  <span className='text-base'>
                    Drag & Drop Page
                  </span>
                  <span className='text-xs'>
                    Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora
                  </span>
                </span>
              </div>
              <div className='flex flex-col items-center m-8'>
                <img className='pb-4'
                  src='https://cdn.shopify.com/s/files/1/1636/8779/files/settings.png?v=1491835711' alt='setting'
                />
                <span className='text-gray-700 flex flex-col text-center gap-2'>
                  <span className='text-base'>
                    Customizable Page
                  </span>
                  <span className='text-xs'>
                    Fusce arcu molestie eget libetro consectetur congue consectetur in bibendum litora
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(Services)