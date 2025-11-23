import React, { Fragment, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../auth/api"
import "../styles/setting.css";
import {Edit, Trash2, StopCircle, Flashlight} from "lucide-react"
import {uploadLogo, removeLogo, getLogo, getCurrencies, saveCurrency} from "../admin/api"
import { API } from "../config";
import Select from "react-select";
import { useCurrency } from "../CurrencyContext";

const OrganizationalSettings = ({ directLink = "", activeSection = "", setDirectLink , refreshLogo}) => {
  const { user, token } = isAuthenticated();
  const {setCurrencyCode} = useCurrency()
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState("PKR");
  const [logo, setLogo] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [currrencies, setCurrencies] = useState([])
  
  const inputRef = useRef(null)
  const [companyName, setCompanyName] =useState("")
  const [isReadOnly, setIsReadOnly] = useState(true)
 

useEffect(()=>{
  fetchLogo();
  fetchCurrencies()
  

}, [])
 const fetchLogo = async () => {
    try {
      const data = await getLogo(user.organization, token);
      // console.log(data)
      if(data?.status === 404){
        // setCompanyName("SimplyBill")
        // setIsReadOnly(prev => !prev)
      }
      if (!data.error) {
        // console.log(API + data.path)
        setCompanyName(data?.companyName)
        // setTakeLogo(data)
        setImagePreviewUrl(API + data.path); // API is your base URL
      }
    } catch (err) {
      console.error("Error fetching logo:", err);
    }
  };

  const fetchCurrencies = async() =>{
   const data =  await getCurrencies()
  // console.log(data)
   setCurrencies(data)
  }

//   const [currencies, setCurrencies] = useState([])
// const fetchCurrencies =async () => {
//  const response = await fetch(`https://restcountries.com/v3.1/all?fields=currencies`, {
//   method:"GET"
//  })

//  let data = await response.json()
//   for(let i=0; i<2; i++) {
//   console.log(data[i])
//  }
//  for(const country of data){

  // setCurrencies(data )
//   for(const [code, info] of Object.entries(country.currencies))
//  console.log(info.name)
//  }
// }

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) =>{
  
  setCompanyName(e.target.value)
  }

  const handleSave = async() => {
   
    const formData = new FormData()
    formData.append("logo",logo)
    formData.append("organization", user.organization)
    formData.append("companyName", companyName )
    
    // console.log(formData);
    const data = await uploadLogo(formData, token)
    const updateCurrency = await  saveCurrency(user?._id ,selected?.value )
    if(updateCurrency.message){
      console.log("currencyu updated")
    } else if(updateCurrency.error){
      console.log(updateCurrency.error)
    }
   if (updateCurrency) {
  // Safely parse JWT from localStorage
  const storedJwt = localStorage.getItem("jwt");
  if (!storedJwt) {
    console.warn("No JWT found in localStorage");
    return;
  }

  const jwt = JSON.parse(storedJwt);

  // ✅ Update only if user object exists
  if (jwt.user) {
    jwt.user.currency = updateCurrency; // set the new currency
    localStorage.setItem("jwt", JSON.stringify(jwt));
    setCurrencyCode(updateCurrency?.code)
    console.log("LocalStorage updated with new user currency!");
  } else {
    console.warn("JWT found but missing user data");
  }
}
    
    if(data.error){
      console.log(data?.error)
    } else {
      alert("Settings saved successfully!");
      refreshLogo()
    }
  };

const removeLogoButton = async() => {
  try{
  const data = await removeLogo(user.organization, token)
  
  if(data.error && data.status === 404){
    setImagePreviewUrl(null)
    setCompanyName("")
  } else {
    console.log(data.message)
    setImagePreviewUrl(null)
    setCompanyName("")
  }
} catch(error){
  console.log(error)
}
}

const changeName = () => {
if(inputRef?.current?.readOnly == true){
  inputRef.current.readOnly = false
  setIsReadOnly(prev => !prev);
} else {
   inputRef.current.readOnly = true
   setIsReadOnly(prev => !prev);
}
}

const options= currrencies?.map(item=>({
  value:item._id,
  label:item.code,
  name: item?.name
}))
 
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const usdOption = user.currency;
      setSelected({ value: usdOption._id, label: usdOption.code, name: usdOption?.name  });
    
  }, []);

  
  return (
    <div className="settings-container">
      
      <h2 className="settings-title">Settings</h2>
      <p className="settings-subtitle">Manage system appearance and preferences</p>

      {/* Appearance Section */}
      <div className="settings-card">
        <h3 className="settings-section-title">Appearance</h3>

        {/* Logo Upload */}
        <div className="settings-row">
          <div>
            <p className="settings-label">Custom Logo</p>
            <p className="settings-description">
              Upload or change your dashboard logo
            </p>
          </div>

          {/* Custom Upload Box */}
          <div className="upload-container">
          

            <input
              type="file"
              id="logo-upload"
              onChange={handleLogoChange}
              className="hidden-file-input"
              accept="image/*"
              />
              

            <label htmlFor="logo-upload" className="custom-upload-box" >
              {imagePreviewUrl ? (
                <Fragment>
                <img src={imagePreviewUrl} alt="Logo Preview" className="uploaded-logo" />
                
                </Fragment>
              ) : (
                <span className="upload-plus">+</span>
              )}
            </label>
           <div style={{display: "flex", justifyContent: "flex-end", cursor: "pointer"}}>
                {imagePreviewUrl &&<Trash2 size={18} onClick={removeLogoButton}/>}
        </div>
          </div>
        </div>
        

        {/* Dark Mode */}
        <div className="settings-row">
          <div>
            <p className="settings-label">Company Name</p>
            <p className="settings-description">Enter your company name</p>
          </div>
          <div style={{display: "flex", alignItems:"center", position:"relative"}}>
          <input ref={inputRef} readOnly={isReadOnly} value={companyName} onChange={handleChange} type="text"  style={{borderRadius: "10px", padding:"5px", outline: "none"}} />
         <div style={{position:"absolute", top: "104%", right:"0"}} >
          {isReadOnly ?<Edit size={20}  color="grey" cursor={"pointer"} onClick={changeName}/>:
          <StopCircle size={20}  color="red" cursor={"pointer"} onClick={changeName}/>}
          </div>
          </div>
          {/* <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label> */}
        </div>

        {/* <div className="settings-row">
          <div>
            <p className="settings-label">Dark Mode</p>
            <p className="settings-description">Enable or disable dark theme</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div> */}
      </div>

      {/* Preferences Section */}
      <div className="settings-card">
        <h3 className="settings-section-title">Preferences</h3>

        <div className="settings-row">
          <p className="settings-label">Currency</p>
          {/* <select
          style={{height:"50px"}}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="select-input"
          > */}
            {/* {currrencies?.map((currency, index)=>{
                return <option  key={index} value={currency._id}>{currency.code}</option> */}

            {/* })} */}

            {/* <option value="PKR">PKR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option> */}
          {/* </select> */}
          <div>
       <p>{selected?.name}</p>
          <Select value={selected} onChange={setSelected}   placeholder="Select Currency" options={options}/>

          </div>
        </div>
              

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
       
        {/* <a href="https://restcountries.com/v3.1/all?fields=currencies
" download>currencies</a> */}
{/* <button onClick={fetchCurrencies}>Get Currencies</button> */}

      </div>
    </div>
  );
};

export default OrganizationalSettings;
