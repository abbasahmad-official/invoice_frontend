import React from 'react'
import "../styles/parts.css"
import {DollarSign, Users, Clock, TrendingUp } from "lucide-react";
const icons = {
  TrendingUp,
  DollarSign,
  Clock,
  Users
};
import { isAuthenticated } from '../auth/api';
const Card = ({icon="DollarSign", title="card", number="443", subtitle="From 2 invoices" , dollar ,iconColor="black", icon2}) => {
    const IconComponent = icons[icon];
    const {user:{currency}, token} = isAuthenticated()
  return (
    <div className='card'>
        <div className="card-header">
        <p>{title}</p>   
      {icon2?<p style={{color: iconColor}}>{icon2}</p>:<IconComponent size={15} color={iconColor} />}
        </div>
        <div className="lower-card">
            <h3>{(dollar && currency)? currency.symbol+ " " :""}{number}</h3>
            <p>{subtitle}</p>
        </div>

    </div>
  )
}

export default Card
