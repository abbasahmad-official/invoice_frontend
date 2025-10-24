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

const TagCard = ({icon, iconColor, tagName, numbers}) => {
    const IconComponents = icons[icon];
  return (
    <div className="tag-card">
      <div className="icon">
        <IconComponents color={iconColor} />
      </div>
      <div className="info">
        <p>{tagName}</p>
        <p>{numbers}</p>
      </div>
    </div>
  )
}

export default TagCard
