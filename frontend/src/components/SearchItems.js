import React, { memo, useEffect, useState } from 'react'
import icons from '../utils/icons'
import { colors } from '../utils/contants'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'

const { AiOutlineDown } = icons

const SearchItems = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const { category } = useParams();
    const [selected, setSelected] = useState([])
    const handleSelect = (e) => {
        
        const alreadyElement = selected.find(el => el === e.target.value);
        if (alreadyElement) {
            setSelected(prev => prev.filter(el => el !== e.target.value))
        } else {
            setSelected(prev => [...prev, e.target.value])
        }
        changeActiveFilter(null);
    }
    useEffect(() => {
        navigate({
            pathname: `/${category}`,
            search: createSearchParams({
                color: selected
            }).toString()
        })
    }, [selected])
    // console.log(selected);
    return (
        <div
            className='p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center'
            onClick={() => changeActiveFilter(name)}
        >
            <span className='capitalize'>{name}</span>
            <AiOutlineDown />
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
                {type === 'checkbox' && <div className=''>
                    <div className='p-4 items-center flex justify-between gap-8 border-b'>
                        <span className='whitespace-nowrap'>{`${selected.length} selecteds`}</span>
                        <span
                            className='underline hover:text-main cursor-pointer'
                            onClick={e => {
                                e.stopPropagation()
                                setSelected([]);
                            }}
                        >
                            Reset
                        </span>
                    </div>
                    <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                        {colors.map((el, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <input
                                    type='checkbox'
                                    className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500'
                                    value={el}
                                    id={el}
                                    onChange={handleSelect}
                                    checked={selected.some(selectedItem => selectedItem === el)}
                                />
                                <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>}

        </div>
    )
}

export default memo(SearchItems)