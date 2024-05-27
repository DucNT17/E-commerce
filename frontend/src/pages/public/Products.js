import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumb, Product, SearchItems } from '../../components';
import { apiGetProducts } from '../../apis';
import Masonry from 'react-masonry-css'

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [params] = useSearchParams();
  // console.log(params.entries());
  const fetchProductsByCategory = async (queries) => {
    const response = await apiGetProducts(queries);
    if (response.success) {
      setProducts(response.products);
    }

  }
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) {
      param.push(i)
    }
    const queries = {};
    for(let i of params){
      queries[i[0]] = i[1];
    }
    console.log(param);
    fetchProductsByCategory(queries);
  }, [params])
  const changeActiveFilter = useCallback((name) => {
    if (activeClick === name) {
      setActiveClick(null);
    } else {
      setActiveClick(name);
    }
  }, [activeClick])
  return (
    <div className='w-full'>
      <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>{category}</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className='w-main border p-4 flex justify-between mt-4 m-auto'>
        <div className='w-4/5 flex-auto flex flex-col gap-2'>
          <span className='font-semibold text-sm'>Filter by</span>
          <div className='flex items-center gap-4'>
            <SearchItems name='price' activeClick={activeClick} changeActiveFilter={changeActiveFilter} type='input' />
            <SearchItems name='color' activeClick={activeClick} changeActiveFilter={changeActiveFilter} />
          </div>
        </div>
        <div className='w-1/5 '>
          Soft by
        </div>
      </div>
      <div className='mt-8 w-main m-auto'>
        <Masonry
          breakpointCols={4}
          className="flex mx-[-10px]"
          columnClassName="my-masonry-grid_column">
          {products?.map(el => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              normal={true}
            />
          ))}
        </Masonry>
      </div>
      <div className='w-full h-[500px]'>

      </div>
    </div>
  )
}

export default Products