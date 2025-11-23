import React from 'react'
import {Package, Tag, DollarSign, Globe, AlertTriangle, CheckCircle} from 'lucide-react'
import '../styles/parts.css'

const icons = {
  Package,
  Tag,
  DollarSign,
  Globe,
  CheckCircle,
  AlertTriangle
};

const TagCard = ({icon, iconColor, tagName, numbers, icon2, icon2Color}) => {
    const IconComponents = icons[icon];
  return (
    <div className="tag-card">
      <div className="icon">
        {icon2 ? <p  style={{color: icon2Color, fontSize:"25px"}}>{icon2}</p>: <IconComponents color={iconColor} /> }
        
      </div>
      <div className="info">
        <p>{tagName}</p>
        <p>{numbers}</p>
      </div>
    </div>
  )
}

export default TagCard
