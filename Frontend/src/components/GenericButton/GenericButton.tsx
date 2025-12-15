"use client"
import React from 'react';


interface GenericButtonProps {
  textButton: string;
  type:"submit" | "button";
  onClick?: ()=>void;

  //size none if you want to use a custom size with the “className” prop
  size: "lg" | "md" | "sm" | "full" | "none";
  className?: string;
  variant: "black" | "white"


}

const GenericButton = ({textButton, type, onClick, size, className, variant}:GenericButtonProps) => {

  const sizeButton = {
    "lg": "w-lg",
    "md": "w-md",
    "sm": "w-sm",
    "full":"w-full",
    "none": "w-0"
  }

  const variantButton = {
    "black": "px-8 py-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl bg-black text-white hover:bg-gray-900 hover:scale-105 mb-8 py-4 text-lg font-semibold",
    "white":"px-8 py-3  transition-all duration-300 font-semibold shadow-lg hover:shadow-xl bg-white text-black border-2 border-black hover:bg-gray-100 hover:scale-105  mb-8 py-4 text-lg font-semibold"
  }

  return(
    <button className={` rounded-xl ${sizeButton[size]} ${className} ${variantButton[variant]}`} type={type} onClick={onClick} >{textButton}</button>
  )
}


export default GenericButton