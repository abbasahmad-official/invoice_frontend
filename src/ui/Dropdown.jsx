import React,{useEffect, useState, Fragment} from 'react'
import {ChevronDown} from "lucide-react";
import "../styles/parts.css";

const Dropdown = ({text="All Status",setForm, form, setStatus  = ()=>  0  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(text);


    useEffect(() => {
        const handleClickOutside = (event) => { 
            if (!event.target.closest('.dropdown')) {
                setIsOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

     const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // close menu after selection
  };

  useEffect(() => {
    if(form){
      setForm((prevForm) => ({ ...prevForm, status: selectedOption }));
    }

}, [selectedOption]);

useEffect(() => {
    // onStatusChange(selectedOption)
  setStatus(selectedOption)
}, [selectedOption]);

  return (
    <Fragment>
      <div className="dummy">
    <div className='dropdown' onClick={()=>setIsOpen(!isOpen)}>
        <p>{selectedOption}</p>
      <ChevronDown width={15} color='#b7b7b9ff'/>
    </div>
    {isOpen && <div className='dropdown-menu'>
        <p onClick={() => handleSelect("All Status")}>All Status</p>
        <p onClick={() => handleSelect("Overdue")}>Overdue</p>
          <p onClick={() => handleSelect("Pending")}>Pending</p>
          <p onClick={() => handleSelect("Paid")}>Paid</p>
    </div>}
    </div>
   </Fragment>
  )
}

export default Dropdown
