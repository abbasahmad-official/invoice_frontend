import React, { Fragment, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../auth/api"
import "../styles/setting.css";
import {Edit, Trash2, StopCircle, Flashlight} from "lucide-react"
import {uploadLogo, removeLogo, getLogo, getCurrencies, saveCurrency} from "../admin/api"
import { API } from "../config";
import Select from "react-select";
import { useCurrency } from "../CurrencyContext";
import SpinningWheel from "../ui/SpinningWheel"
import Success from "../ui/Success"
import Button from "../ui/Button";

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
   const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [logoRemove, setLogoRemove] = useState(false)
 

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
   setCurrencies(data)
  }


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
   setLoading(true)
   setSuccess(null)
   setError(null)

    const formData = new FormData()
    formData.append("logo",logo)
    formData.append("organization", user.organization)
    formData.append("companyName", companyName )
    
    // console.log(formData);
    const data = await uploadLogo(formData, token)
       if(data.error){
      console.log(data.error)
      setError(data.error)
      setLoading(false)

    } else {

     const updateCurrency = await  saveCurrency(user?._id ,selected?.value )
     if(!updateCurrency){
      console.log("No currency found")
      setError("No currency found")
      return
     }
    if(updateCurrency.message){
        setSuccess(updateCurrency.message)

    } else if(updateCurrency.error){
      
      setError(updateCurrency.error)
      console.log(updateCurrency.error)
      setLoading(false)
      return
    }
  
  // Safely parse JWT from localStorage
  const storedJwt = localStorage.getItem("jwt");
  if (!storedJwt) {
    console.warn("No JWT found in localStorage");
    return;
    }
  const jwt = JSON.parse(storedJwt);
// 
  // ✅ Update only if user object exists
  if (jwt.user) {
    jwt.user.currency = updateCurrency; // set the new currency
    localStorage.setItem("jwt", JSON.stringify(jwt));
    setCurrencyCode(updateCurrency?.code)
    console.log("LocalStorage updated with new user currency!");
  } else {
    console.warn("JWT found but missing user data");
    return
  }
}
    if(data.error){
      console.log(data?.error)
      setError(data.error)
      setLoading(false)
    } else {
      setSuccess("setting saved successfully")
      successTimeout()
      refreshLogo()
      setIsReadOnly(true)
      setLoading(false)
    }

  };

  

  const successTimeout = () =>{
    setTimeout(()=>{
      setSuccess(null)
    },2000)
  }
    

const removeLogoButton = async() => {
  try{
    setLogoRemove(true)
    setError(null)
    setSuccess(null)
    
  const data = await removeLogo(user.organization, token)
  if(data.error && data.status === 404){
    setSuccess(null)
    setImagePreviewUrl(null)
    setCompanyName("")
    setError(data.error)
    setLogoRemove(false)
  } else {
    setError(null)
    console.log(data.message)
    setImagePreviewUrl(null)
    setCompanyName("")
    refreshLogo() 
    setSuccess(data.message)
    successTimeout()
    setLogoRemove(false)
  }
} catch(error){
  setLogoRemove(false)
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
      {success && <Success message={success} />}
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
           {/* <div style={{display: "flex", justifyContent: "flex-end", cursor: "pointer"}}>
                {imagePreviewUrl &&<Trash2 size={18} onClick={removeLogoButton}/>}
        </div> */}
          </div>
        </div>
        

        {/* Dark Mode */}
        <div className="settings-row">
          <div>
            <p className="settings-label">Company Name</p>
            <p className="settings-description">Enter your company name</p>
          </div>
          <div className="input-company" style={{display: "flex", alignItems:"center", position:"relative"}}>
          <input ref={inputRef} readOnly={isReadOnly} value={companyName} onChange={handleChange} type="text"  style={{borderRadius: "10px", padding:"5px", outline: "none"}} />
               <div className="company-name" >
          {isReadOnly && <Button onClick={()=>setIsReadOnly(false)} text={"Edit"} icon="Edit"  blackHover={true}  />}
          <Button loading={logoRemove}  onClick={removeLogoButton} icon="Trash2" text={"Remove"} blackHover={true} />
          </div>
         {/* <div style={{position:"absolute", top: "104%", right:"0"}} >
          {isReadOnly ?<Edit size={20}  color="grey" cursor={"pointer"} onClick={changeName}/>:
          <StopCircle size={20}  color="red" cursor={"pointer"} onClick={changeName}/>}
          </div> */}
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
          <div className="selection">
            <p>{selected?.name}</p>
            <div className="selection-component">

            <Select
              value={selected}
              onChange={setSelected}
              placeholder="Select Currency"
              options={options}
              />
              </div>
          </div>
        </div>
              

        <button className="save-btn select-padding" onClick={handleSave}>
          {loading?<SpinningWheel size={25}/>:"Save Changes"}
        </button>
       
        {/* <a href="https://restcountries.com/v3.1/all?fields=currencies
" download>currencies</a> */}
{/* <button onClick={fetchCurrencies}>Get Currencies</button> */}

      </div>
    </div>
  );
};

export default OrganizationalSettings;
