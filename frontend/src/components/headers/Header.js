import React, { Fragment, memo, useEffect, useState } from 'react'
import logo from 'assets/logo.png'
import icons from 'utils/icons'
import { Link } from 'react-router-dom'
import path from 'utils/path'
import { useSelector } from 'react-redux'
import { logout } from 'store/user/userSlice'
import withBaseComponent from 'hocs/withBaseComponent'
import { showCart } from 'store/app/appSlice'

const { RiPhoneFill, MdEmail, LuShoppingBag, FaUserCircle } = icons;

const Header = ({ dispatch }) => {
  const { current } = useSelector(state => state.user);
  const [isShowOptions, setIsShowOption] = useState(false);
  useEffect(() => {
    const handleClickoutOptions = (e) => {
      const profile = document.getElementById('profile');
      if (!profile?.contains(e.target)) {
        setIsShowOption(false);
      }
    }

    document.addEventListener('click', handleClickoutOptions);

    return () => {
      document.removeEventListener('click', handleClickoutOptions);
    }
  }, [])
  return (
    <div className='flex justify-between w-main h-[100px] py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className='w-[234px] object-contain' />
      </Link>
      <div className='flex text-[13px]'>
        <div className='flex flex-col items-center px-6 border-r'>
          <span className='flex gap-4 items-center'>
            <RiPhoneFill color='red' />
            <span className='font-semibold'>(+1800) 000 8808</span>
          </span>
          <span>
            Mon-Sat 9:00AM - 8:00PM
          </span>
        </div>
        <div className='flex flex-col items-center px-6 border-r'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='red' />
            <span className='font-semibold'>SUPPORT@DIGITALSTORE.COM</span>
          </span>
          <span>
            Online Support 24/7
          </span>
        </div>
        {current && <Fragment>
          <div onClick={() => dispatch(showCart({ signal: true }))} className='flex items-center justify-center gap-2 px-6 border-r cursor-pointer'>
            <LuShoppingBag color='red' />
            <span>
              {`${current?.cart?.length || 0} item(s)`}
            </span>
          </div>
          <div
            // to={+current?.role === 1 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
            onClick={() => setIsShowOption(prev => !prev)}
            className='flex items-center justify-center px-6 gap-2 cursor-pointer relative'
            id='profile'
          >
            <FaUserCircle color='red' />
            <span>Profile</span>
            {isShowOptions && <div onClick={e => e.stopPropagation()} className='absolute flex flex-col top-full left-[10px] bg-gray-100 min-w-[150px] border rounded-lg z-10'>
              <Link className='p-2 w-full hover:bg-sky-100 border-b-2 font-semibold' to={`/${path.MEMBER}/${path.PERSONAL}`}>
                Profile
              </Link>
              {+current?.role === 1 && <Link className='p-2 w-full hover:bg-sky-100 border-b-2 font-semibold' to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                Admin workspace
              </Link>}
              <span className='p-2 w-full hover:bg-sky-100 font-semibold' onClick={() => dispatch(logout())}>
                Logout
              </span>
            </div>}
          </div>
        </Fragment>}
      </div>
    </div >
  )
}

export default withBaseComponent(memo(Header))