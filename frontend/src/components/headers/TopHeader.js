import React, { memo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import path from 'utils/path';
import { getCurrent } from 'store/user/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import icons from 'utils/icons';
import { logout, clearMessage } from 'store/user/userSlice';
import Swal from 'sweetalert2';


const { AiOutlineLogout } = icons;

const TopHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, current, mes } = useSelector(state => state.user);
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) {
                dispatch(getCurrent());
            }
        }, 300)

        return () => {
            clearTimeout(setTimeoutId);
        }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (mes) {
            Swal.fire('Oops', mes, 'info').then(() => {
                dispatch(clearMessage());
                navigate(`/${path.LOGIN}`);
            })
        }
    }, [mes])
    return (
        <div className='h-[40px] w-full bg-main flex items-center justify-center'>
            <div className='w-main flex items-center justify-between text-xs text-white'>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                {isLoggedIn && current
                    ? <div className='flex items-center gap-1 text-sm'>
                        <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
                        <span className='hover:rounded-full hover:bg-gray-200 p-2 hover:text-main cursor-pointer'
                            onClick={() => dispatch(logout())}
                        >
                            <AiOutlineLogout size={18} />
                        </span>
                    </div>
                    : <Link to={`${path.LOGIN}`} className='hover:text-gray-900'>Sign In or Create Account</Link>
                }
            </div>
        </div>
    )
}

export default memo(TopHeader)