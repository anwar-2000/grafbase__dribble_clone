import React, { MouseEventHandler } from 'react'
import Image from 'next/image'


type Props =  {
    title : string,
    LeftIcon? : string | null,
    RightIcon? : string |null,
    handleClick? : MouseEventHandler
    type?:'button' | 'submit' ,
    isSubmitting? : boolean,
    bgColor? : string,
    textColor? : string
}

const Button:React.FC<Props> = ({title , LeftIcon , RightIcon , handleClick , type , isSubmitting , bgColor , textColor , }) => {
  return (
    <button
    type={type || 'button'}
    disabled={isSubmitting}
    className={`flexCenter gap-3 px-4 py-3 
          ${textColor || 'text-white'}
          ${isSubmitting ? 'bg-black/50' : bgColor ? bgColor : 'bg-primary-purple'} rounded-xl text-sm font-medium max-md:w-full
    `}
    onClick={handleClick}
    >
        
        {LeftIcon && <Image src={LeftIcon} width={14} height={14} alt="left" />}
        {title}
        {RightIcon && <Image src={RightIcon} width={14} height={14} alt="left" />}
    </button>
  )
}

export default Button