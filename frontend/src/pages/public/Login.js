import React, { useState, useCallback, useEffect } from 'react'
import loginBackground from 'assets/background.jpg'
import { InputFieldLogin, Button, Loading } from 'components'
import {
  apiRegister,
  apiLogin,
  apiForgotPassword,
  apiFinalRegister
} from 'apis'
import Swal from 'sweetalert2'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import path from 'utils/path'
import { login } from 'store/user/userSlice'
import { showModal } from 'store/app/appSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from 'utils/helper'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: ''
  });
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassWord, setisForgotPassWord] = useState(false);
  const [searchParams] = useSearchParams();
  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: ''
    })
  }
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      setisForgotPassWord(false);
      toast.success(response.mes)
    } else {
      toast.error(response.mes)
    }
  }
  useEffect(() => {
    resetPayload();
  }, [isRegister])
  // Submit
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields);
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiRegister(payload);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if (response.success) {
          setIsVerifiedEmail(true);
          // Swal.fire('Congratulations', response.mes, 'success').then(() => {
          //   setIsRegister(false);
          //   resetPayload();
          // });
        } else {
          Swal.fire('Oops', response.mes, 'error')
        }
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          Swal.fire('Login successfully', rs.mes, 'success').then(() => {
            dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }));
            searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
          });
        } else {
          Swal.fire('Oops', rs.mes, 'error')
        }
      }
    }
  }, [payload, isRegister, navigate, dispatch])

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire('Congratulations', response.mes, 'success').then(() => {
        setIsRegister(false);
        resetPayload();
      });
    } else {
      Swal.fire('Oops', response.mes, 'error')
    }
    setIsVerifiedEmail(false);
    setToken('');
  }

  return (
    <div className='w-screen h-screen relative'>

      {isVerifiedEmail && <div className='absolute top-0 left-0 right-0 bottom-0 bg-black-rbga z-50 flex flex-col justify-center items-center'>
        <div className='bg-white w-[500px] rounded-md p-8'>
          <h4 className=''>We sent a code to your mail. Please check your mail and enter your code</h4>
          <input type='text' value={token} onChange={e => setToken(e.target.value)} className='p-2 border rounded-md outline-none' />
          <button type='button'
            className='px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4'
            onClick={finalRegister}
          >
            Submit
          </button>
        </div>
      </div>}

      {isForgotPassWord && <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email'>Enter your email:</label>
          <input type='text' id='email'
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
            placeholder='email@gmail.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className='flex items-center justify-end gap-4'>
            <Button

              handleOnClick={handleForgotPassword}
              // eslint-disable-next-line
              style='px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2' 
            >Submit</Button>
            <Button
              handleOnClick={() => setisForgotPassWord(false)}
            >Cancel</Button>
          </div>
        </div>
      </div>}

      <img src={loginBackground} alt=''
        className='w-full h-full object-cover' />
      <div className='absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
          <h1 className='text-[28px] font-semibold mb-8 text-main'>{isRegister ? 'Register' : 'Login'}</h1>
          {isRegister && <div className='flex items-center gap-2'>
            <InputFieldLogin
              value={payload.firstname}
              setValue={setPayload}
              nameKey='firstname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputFieldLogin
              value={payload.lastname}
              setValue={setPayload}
              nameKey='lastname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>}
          <InputFieldLogin
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          {isRegister && <InputFieldLogin
            value={payload.mobile}
            setValue={setPayload}
            nameKey='mobile'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />}
          <InputFieldLogin
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button
            handleOnClick={handleSubmit}
            fw
          >{isRegister ? 'Register' : 'Login'}</Button>
          <div className='w-full flex items-center justify-between my-2 text-sm'>
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setisForgotPassWord(true)}>Forgot your account?</span>}
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setIsRegister(true)}>Create account</span>}
            {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center' onClick={() => setIsRegister(false)}>Go login</span>}
          </div>
          <Link to={`/${path.HOME}`} className='text-blue-500 hover:underline cursor-pointer w-full text-center text-sm'>Go home?</Link>
        </div>
      </div>

    </div>
  )
}

export default Login