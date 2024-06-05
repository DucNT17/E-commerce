import React, { memo, Fragment, useState } from 'react'
import logo from 'assets/logo.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { adminSidebar } from 'utils/contants'
import clsx from "clsx";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-blue-500 text-gray-100";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-blue-100";

const AdminSidebar = ({ navigate }) => {
    const [actived, setActived] = useState([]);
    const handleShowTabs = (tabID) => {
        if (actived.some((el) => el === tabID))
            setActived((prev) => prev.filter((el) => el !== tabID));
        else setActived((prev) => [...prev, tabID]);
    };
    return (
        <div className='bg-white h-full py-4 uppercase'>
            <Link to={'/'} className="flex flex-col justify-center items-center p-4 gap-2">
                <img src={logo} alt="logo" />
                <p>Admin Dashboard</p>
            </Link>
            <div className='flex flex-col gap-3'>
                {adminSidebar?.map(el => (
                    <Fragment key={el.id}>
                        {el.type === "SINGLE" && (
                            <NavLink
                                to={el.path}
                                className={({ isActive }) =>
                                    clsx(isActive && activedStyle, !isActive && notActivedStyle)
                                }
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        )}
                        {el.type === "PARENT" && (
                            <div
                                onClick={() => handleShowTabs(+el.id)}
                                className="flex flex-col">
                                <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-100 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span>{el.icon}</span>
                                        <span>{el.text}</span>
                                    </div>
                                    {actived.some((id) => id === el.id) ? (
                                        <AiOutlineCaretRight />
                                    ) : (
                                        <AiOutlineCaretDown />
                                    )}
                                </div>
                                {actived.some((id) => +id === +el.id) && (
                                    <div className="flex flex-col">
                                        {el.submenu.map((item, idx) => (
                                            <NavLink
                                                key={idx}
                                                to={item.path}
                                                onClick={(e) => e.stopPropagation()}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive && activedStyle,
                                                        !isActive && notActivedStyle,
                                                        "pl-16"
                                                    )
                                                }>
                                                {item.text}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
                <Link to={'/'} className={notActivedStyle}>
                    <span>
                        <RiShareForwardLine />
                    </span>
                    <span className="uppercase">về trang chủ</span>
                </Link>
            </div>
        </div>
    )
}

export default memo(AdminSidebar)