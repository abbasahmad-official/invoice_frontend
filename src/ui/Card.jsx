import React from 'react'
import "../styles/parts.css"
import {DollarSign, Users, Clock, TrendingUp } from "lucide-react";
const icons = {
  TrendingUp,
  DollarSign,
  Clock,
  Users
};
const Card = ({icon="DollarSign", title="card", number="443", subtitle="From 2 invoices" , dollar ,iconColor="black"}) => {
    const IconComponent = icons[icon];
  return (
    <div className='card'>
        <div className="card-header">
        <p>{title}</p>   
      <IconComponent size={15} color={iconColor} />
        </div>
        <div className="lower-card">
            <h3>{dollar && "$"}{number}</h3>
            <p>{subtitle}</p>
        </div>

    </div>
  )
}

export default Card
