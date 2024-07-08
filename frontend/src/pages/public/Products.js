import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams, createSearchParams } from 'react-router-dom'
import {
  Breadcrumb,
  Product,
  SearchItems,
  InputSelect,
  Pagination
} from '../../components';
import { apiGetProducts } from '../../apis';
import Masonry from 'react-masonry-css'
import { sorts } from '../../utils/contants';
import withBaseComponent from 'hocs/withBaseComponent';


const Products = ({ navigate }) => {
  const titleRef = useRef()
  const { category } = useParams();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [params] = useSearchParams();
  const [sort, setSort] = useState('')


  const fetchProductsByCategory = async (queries) => {
    if (category && category !== 'products') {
      queries.category = category;
    }
    const response = await apiGetProducts({ ...queries, limit: process.env.REACT_APP_LIMIT });
    if (response.success) {
      setProducts(response);
    }
  }
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    let priceQuery = {};
    if (queries.from && queries.to) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ]
      }
      delete queries.price;
    } else {
      if (queries.from) {
        queries.price = { gte: queries.from }
      }

      if (queries.to) {
        queries.price = { lte: queries.to }
      }
    }

    delete queries.from;
    delete queries.to;
    const q = { ...priceQuery, ...queries }
    window.scrollTo(0, 0);
    fetchProductsByCategory(q);
    titleRef.current.scrollIntoView({ block: 'center' });
  }, [params]);

  const changeActiveFilter = useCallback((name) => {
    if (activeClick === name) {
      setActiveClick(null);
    } else {
      setActiveClick(name);
    }
  }, [activeClick])

  const changeValue = useCallback((value) => {
    setSort(value);
  }, [sort])

  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({
          sort: sort
        }).toString()
      })
    }
  }, [sort])


  return (
    <div ref={titleRef} className='w-full'>
      {/* Breadcrumb */}
      <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>{category}</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      {/* Filter */}
      <div className='w-main border p-4 flex justify-between mt-4 m-auto'>
        <div className='w-4/5 flex-auto flex flex-col gap-2'>
          <span className='font-semibold text-sm'>Filter by</span>
          <div className='flex items-center gap-4'>
            <SearchItems name='price' activeClick={activeClick} changeActiveFilter={changeActiveFilter} type='input' />
            <SearchItems name='color' activeClick={activeClick} changeActiveFilter={changeActiveFilter} />
          </div>
        </div>
        <div className='w-1/5 flex flex-col gap-2'>
          <span className='font-semibold text-sm'>
            Sort by
          </span>
          <div className='w-full'>
            <InputSelect value={sort} options={sorts} changeValue={changeValue} />
          </div>
        </div>
      </div>
      {/* Product Card */}
      <div className='mt-8 w-main m-auto'>
        <Masonry
          breakpointCols={4}
          className="flex mx-[-10px]"
          columnClassName="my-masonry-grid_column">
          {products?.products?.map(el => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              normal={true}
            />
          ))}
        </Masonry>
      </div>
      {/* Pagination */}
      <div className='w-main m-auto flex my-4 justify-end py-8'>
        <Pagination
          totalCount={products?.counts}
        />
      </div>
    </div>
  )
}

export default withBaseComponent(Products)