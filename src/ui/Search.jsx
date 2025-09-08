import React from 'react'
import {Search} from "lucide-react"
import Dropdown from './Dropdown'
import "../styles/parts.css"

const SearchBar = ({status, value, onChange, setStatus}) => {
  return (
    <div>
      <div className="search-container">
        <div className="search-box">
            <div className="search-icon">
                <Search width={15} color='#b7b7b9ff'/>
            </div>
          <input type="text" placeholder="Search..." onChange={onChange} value={value} /> 
            </div>    
            {status && <div className="filter">
                <Dropdown setStatus={setStatus} /> 
             </div>}
      </div>
    </div>
  )
}

export default SearchBar
