import React from 'react'
import {Plus, ArrowLeftIcon, LogOut, Save, Trash2, Download, CreditCard} from "lucide-react"
import "../styles/parts.css"

const icons = {
  Plus, 
  ArrowLeftIcon,
  LogOut,
  Save,
  Trash2,
  Download,
  CreditCard
}

const Button = ({noIcon=false ,hover="on" ,text, backgroundColor="black", color="rgb(235, 233, 233)", width="fit-content", border="none", blackHover, icon="Plus"}) => {
  const IconComponent = icons[icon]
  
  return (
    <div className={`btnn ${hover}`}>
        <button className={blackHover && "btn"} style={{backgroundColor: backgroundColor, color: color, width:width, border:border}}>{(!noIcon &&<IconComponent width={15}/>)} {text}</button>
    </div>
  )
}

export default Button
