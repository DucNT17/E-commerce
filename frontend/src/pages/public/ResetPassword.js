import React, { useState } from 'react'
import { Button } from '../../components';
import { useParams } from 'react-router-dom';
import { apiResetPassword } from '../../apis'
import { toast } from 'react-toastify';
import withBaseComponent from 'hocs/withBaseComponent';
import path from 'utils/path';

const ResetPassword = ({ navigate }) => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });
    if (response.success) {
      toast.success(response.mes);
      navigate(`/${path.LOGIN}`)
    } else {
      toast.error(response.mes);
    }
  }
  return (
    <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
      <div className='flex flex-col gap-4'>
        <label htmlFor='password'>Enter your new password:</label>
        <input type='password' id='password'
          className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
          placeholder='type here'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className='flex items-center justify-end gap-4'>
          <Button
            handleOnClick={handleResetPassword}
            // eslint-disable-next-line
            style='px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2'
          >Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(ResetPassword)