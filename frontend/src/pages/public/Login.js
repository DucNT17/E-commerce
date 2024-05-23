import React, { useState, useCallback } from 'react'
import loginBackground from '../../assets/background.jpg'
import { InputField, Button } from '../../components'

const Login = () => {

  const [payload, setPayload] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const handleSubmit = useCallback(() => {
    console.log(payload);
  }, [payload])
  console.log(isRegister);
  return (
    <div className='w-screen h-screen relative'>
      <img src={loginBackground} alt=''
        className='w-full h-full object-cover' />
      <div className='absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
          <h1 className='text-[28px] font-semibold mb-8 text-main'>{isRegister ? 'Register' : 'Login'}</h1>
          {isRegister && <InputField
            value={payload.name}
            setValue={setPayload}
            nameKey='name'
          />}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
          />
          <Button
            name={isRegister ? 'Register' : 'Login'}
            handleOnClick={handleSubmit}
            fw
          />
          <div className='w-full flex items-center justify-between my-2 text-sm'>
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer'>Forgot your account?</span>}
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setIsRegister(true)}>Create account</span>}
            {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center' onClick={() => setIsRegister(false)}>Go login</span>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login