import React from 'react'
import {Plus, ArrowLeftIcon, LogOut, Save, Trash2, Download, CreditCard, Send} from "lucide-react"
import "../styles/parts.css"
import SpinningWheel from './SpinningWheel'
const icons = {
  Plus, 
  ArrowLeftIcon,
  LogOut,
  Save,
  Trash2,
  Download,
  CreditCard,
  Send
}

const Button = ({loading=false ,noIcon=false ,hover="on" ,text, backgroundColor="black", color="rgb(235, 233, 233)", width="fit-content", border="none", blackHover, icon="Plus"}) => {
  const IconComponent = icons[icon]
  
  return (
    <div  className={`btnn ${hover}`}>
        <button className={blackHover && "btn"} style={{backgroundColor: backgroundColor, color: color, width:width, border:border}}>
           {loading ? (
    <SpinningWheel size={25}/>
  ) : (
    <>
      {!noIcon && <IconComponent width={15} />}
      {text}
    </>
  )}
        </button>
    </div>
  )
}

export default Button
