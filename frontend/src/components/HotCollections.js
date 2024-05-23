import React from 'react'
import { useSelector } from 'react-redux'
import icons from '../utils/icons'

const { IoIosArrowForward } = icons

const HotCollections = () => {
    const { categories } = useSelector(state => state.appReducer)
    console.log(categories);
    return (
        <div className='w-full'>
            <h3 className='text-[20px] font-semibold py-[15px] uppercase border-main border-b-2'>hot collections</h3>
            <div className='flex flex-wrap gap-4 mt-4 '>
                {categories?.filter(el => el.brand.length > 0)?.map(el => (
                    <div key={el._id} className='w-[396px]'>
                        <div className='border flex p-4 gap-4 min-h-[200px]'>
                            <img src={el.image} alt='collection' className='w-[144px] h-[129px] object-cover flex-1' />
                            <div className='flex-1 text-gray-700'>
                                <h4 className='font-semibold uppercase'>{el.title}</h4>
                                <ul className='text-sm'>
                                    {el?.brand?.map((item) => (
                                        <span key={item} className='flex gap-2 items-center text-gray-500'>
                                            <IoIosArrowForward size={14} />
                                            <li>
                                                {item}
                                            </li>
                                        </span>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HotCollections