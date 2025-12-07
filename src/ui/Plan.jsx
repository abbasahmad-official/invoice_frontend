import React, { useEffect, useState, Fragment, useRef } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/parts.css";

const Plan = ({ text = "All Plans", setForm, form, setStatus = () => 0, scroll = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownMenuRef = useRef(null);

  const selectedOption = text; // controlled by parent

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && scroll && dropdownMenuRef.current) {
      dropdownMenuRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isOpen, scroll]);

  const handleSelect = (option) => {
    setStatus(option); // update parent state
    setIsOpen(false);
  };

  return (
    <Fragment>
      <div className="dummy">
        <div className="dropdown" onClick={() => setIsOpen(!isOpen)}>
          <p>{selectedOption}</p>
          <ChevronDown width={15} color="#b7b7b9ff" />
        </div>

        {isOpen && (
          <div className="dropdown-menu" ref={dropdownMenuRef} style={{ zIndex: 1000 }}>
            <p onClick={() => handleSelect("All Plans")}>All Plans</p>
            <p onClick={() => handleSelect("Free")}>Free</p>
            <p onClick={() => handleSelect("Pro")}>Pro</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Plan;
