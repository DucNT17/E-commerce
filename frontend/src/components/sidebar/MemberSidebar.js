import React, { memo, Fragment, useState } from 'react'
import avatar from 'assets/default_avatar.png'
import { Link, NavLink } from 'react-router-dom'
import { memberSidebar } from 'utils/contants'
import clsx from "clsx";
// import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { useSelector } from "react-redux";


const activedStyle = "px-4 py-2 flex items-center gap-2 bg-blue-500 text-gray-100";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-blue-100";

const MemberSidebar = () => {
    const [actived, setActived] = useState([]);
    const { current } = useSelector((state) => state.user);
    // const handleShowTabs = (tabID) => {
    //     if (actived.some((el) => el === tabID))
    //         setActived((prev) => prev.filter((el) => el !== tabID));
    //     else setActived((prev) => [...prev, tabID]);
    // };
    return (
        <div className='bg-white h-full py-4 w-[280px] flex-none'>
            <div className="w-full flex flex-col items-center justify-center py-4">
                <img
                    src={current?.avatar || avatar}
                    alt="logo"
                    className="w-20 h-20 object-cover rounded"
                />
                <small className='text-xl pt-2'>{`${current?.lastname} ${current.firstname}`}</small>
            </div>
            <div className='flex flex-col gap-3'>
                {memberSidebar?.map(el => (
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
                        {/* {el.type === "PARENT" && (
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
                        )} */}
                    </Fragment>
                ))}
                <Link to={'/'} className={notActivedStyle}>
                    <span>
                        <RiShareForwardLine />
                    </span>
                    <span className="uppercase">Home page</span>
                </Link>
            </div>
        </div>
    )
}

export default memo(MemberSidebar)