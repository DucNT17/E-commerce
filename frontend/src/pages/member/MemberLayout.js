import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import path from 'utils/path';


const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user);
    console.log({ isLoggedIn, current });
    if (!isLoggedIn || !current) {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />;
    }

    return (
        <div>
            MemberLayout
            <div className="flex-auto bg-gray-100 min-h-screen">
                <Outlet />
            </div>
        </div>
    )
}

export default MemberLayout