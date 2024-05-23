import React from 'react'

const Button = ({ name, handleOnClick, style, iconsBefore, iconAfter, fw }) => {
    return (
        <button
            type='button'
            className={style ? style : `px-4 py-2 rounded-md text-white bg-main font-semibold my-2 ${fw ? 'w-full' : 'w-fit'}`}
            onClick={() => {handleOnClick && handleOnClick()}}
        >
            <span>
                {iconsBefore}
                {name}
                {iconAfter}
            </span>
        </button>
    )
}

export default Button