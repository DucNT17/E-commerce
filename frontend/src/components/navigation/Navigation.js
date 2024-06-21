import React, { memo } from 'react'
import { navigation } from 'utils/contants'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  return (
    <div className='w-main h-[48px] py-2 border-y text-sm flex items-center'>
      {navigation.map(el => (
        <NavLink
          to={el.path}
          key={el.id}
          className={({ isActive }) => isActive ? 'pr-8 hover:text-main text-main' : 'pr-8 hover:text-main'}
        >
          {el.value}
        </NavLink>
      ))}
    </div>
  )
}

export default memo(Navigation)