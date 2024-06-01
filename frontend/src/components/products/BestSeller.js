import React, { useState, useEffect, memo } from 'react'
import { apiGetProducts } from 'apis/product'
import { CustomSlider } from 'components';
import laptop1 from 'assets/laptop1.png'
import laptop2 from 'assets/laptop2.png'
import { getNewProducts } from 'store/products/asyncActions'
import { useDispatch, useSelector } from 'react-redux';

const tabs = [
    { id: 1, name: 'best seller' },
    { id: 2, name: 'new arrivals' },
]

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null);
    const [activedTab, setActivedTab] = useState(1);
    const [products, setProducts] = useState(null);
    const dispath = useDispatch();
    const { newProducts } = useSelector(state => state.products)

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-sold' })
        if (response?.success) {
            setBestSellers(response.products);
            setProducts(response.products);
        }
    }
    useEffect(() => {
        fetchProducts();
        dispath(getNewProducts())
    }, [dispath])
    useEffect(() => {
        if (activedTab === 1) {
            setProducts(bestSellers)
        }
        if (activedTab === 2) {
            setProducts(newProducts)
        }
    }, [activedTab, bestSellers, newProducts])
    return (
        <div>
            <div className='flex text-[23px] ml-[-32px]'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold uppercase px-8 border-r text-gray-400 tracking-wide cursor-pointer ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px] border-t-2 border-main pt-3'>
                <CustomSlider products={products} activedTab={activedTab} />
            </div>
            <div className='w-full flex gap-4 mt-6'>
                <img
                    src={laptop1}
                    alt='banner'
                    className='flex-1 object-contain'
                />
                <img
                    src={laptop2}
                    alt='banner'
                    className='flex-1 object-contain'
                />
            </div>
        </div>
    )
}

export default memo(BestSeller)