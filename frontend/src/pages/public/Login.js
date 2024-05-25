import React, { useState, useCallback, useEffect } from 'react'
import loginBackground from '../../assets/background.jpg'
import { InputField, Button } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword } from '../../apis'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import { login } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../utils/helper'

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
  const [invalidFields, setInvalidFields] = useState([])
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassWord, setisForgotPassWord] = useState(false);
  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: ''
    })
  }
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
        const response = await apiRegister(payload);
        if (response.success) {
          Swal.fire('Congratulations', response.mes, 'success').then(() => {
            setIsRegister(false);
            resetPayload();
          });
        } else {
          Swal.fire('Oops', response.mes, 'error')
        }
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          Swal.fire('Congratulations', rs.mes, 'success').then(() => {
            dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }));
            navigate(`/${path.HOME}`);
          });
        } else {
          Swal.fire('Oops', rs.mes, 'error')
        }
      }
    }
  }, [payload, isRegister, navigate, dispatch])
  return (
    <div className='w-screen h-screen relative'>
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
              name='Submit'
              handleOnClick={handleForgotPassword}
              style='px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2'
            />
            <Button
              name='Cancel'
              handleOnClick={() => setisForgotPassWord(false)}
            />
          </div>
        </div>
      </div>}

      <img src={loginBackground} alt=''
        className='w-full h-full object-cover' />
      <div className='absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
          <h1 className='text-[28px] font-semibold mb-8 text-main'>{isRegister ? 'Register' : 'Login'}</h1>
          {isRegister && <div className='flex items-center gap-2'>
            <InputField
              value={payload.firstname}
              setValue={setPayload}
              nameKey='firstname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputField
              value={payload.lastname}
              setValue={setPayload}
              nameKey='lastname'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          {isRegister && <InputField
            value={payload.mobile}
            setValue={setPayload}
            nameKey='mobile'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />}
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <Button
            name={isRegister ? 'Register' : 'Login'}
            handleOnClick={handleSubmit}
            fw
          />
          <div className='w-full flex items-center justify-between my-2 text-sm'>
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setisForgotPassWord(true)}>Forgot your account?</span>}
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setIsRegister(true)}>Create account</span>}
            {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center' onClick={() => setIsRegister(false)}>Go login</span>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login