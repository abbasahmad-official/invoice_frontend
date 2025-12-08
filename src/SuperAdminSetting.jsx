import React, { Fragment, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "./auth/api";
import "./styles/setting.css";
import {Edit, Trash2, StopCircle} from "lucide-react"
import {uploadLogo, removeLogo, getLogo, getLogoPic} from "./admin/api"
import { API } from "./config";
import Button from "./ui/Button"
import Success from "./ui/Success";
import SpinningWheel from "./ui/SpinningWheel";


const SuperAdminSetting = ({ directLink = "", activeSection = "", setDirectLink, refreshLogo }) => {
  const { user, token } = isAuthenticated();

  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState("PKR");
  const [logo, setLogo] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [takeLogo, setTakeLogo] = useState("")
  const inputRef = useRef(null)
  const [companyName, setCompanyName] =useState("")
  const [isReadOnly, setIsReadOnly] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [logoRemove, setLogoRemove] = useState(false)
  // const [isHovered, setIshovered] = useState(false)

useEffect(()=>{
  fetchLogo();
  fetchLogoPic()
}, [])



 const fetchLogo = async () => {
    try {
      const data = await getLogo(user._id, token);
      // console.log(data)
      if(data?.status === 404){
        setCompanyName("SimplyBill")
      }
      if (!data.error) {
        console.log(API + data.path)
        setCompanyName(data?.companyName)
        // setTakeLogo(data)
        // setImagePreviewUrl(API + data.path); // API is your base URL
      }
    } catch (err) {
      console.error("Error fetching logo:", err);
    }
  };
const fetchLogoPic = async () => {
  try {
    const blob = await getLogoPic(user._id, token);
    if(blob.error){
        setImagePreviewUrl("/logo-invoice.png");
        return
      }
     const imageUrl = URL.createObjectURL(blob);
    // console.log(imageUrl)
    setImagePreviewUrl(imageUrl);
  } catch (error) {
    console.error("Failed to fetch logo pic:", error);
    setImagePreviewUrl(null);
  }
};

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
    // console.log(logo)
    setLoading(true)
    const formData = new FormData()
    formData.append("logo",logo)
    formData.append("organization", user._id)
    formData.append("companyName", companyName )
    // console.log(formData);
    const data = await uploadLogo(formData, token)
    if(data.error){
      console.log(data.error)
      setSuccess(null)
      setError(data.error)
      setLoading(false)
    } else {
      // alert("Settings saved successfully!");
      setIsReadOnly(true)
      refreshLogo()
      setError(null)
      setSuccess(data.message)
      setTimeout(()=>{
        setSuccess(null)
      },2000)
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
  const data = await removeLogo(user._id, token)
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

  return (
    <div className="settings-container">
      {success && <Success message={success}/>}
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
          <div className={`upload-container ${isReadOnly? "read-only" : ""}`} >
          

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
          <input ref={inputRef} className={`${isReadOnly? "read-only" : ""}`} readOnly={isReadOnly} value={companyName} onChange={handleChange} type="text"  style={{borderRadius: "10px", padding:"5px", outline: "none"}} />
               <div className="company-name" >
          {isReadOnly && <Button onClick={()=>setIsReadOnly(false)} text={"Edit"} icon="Edit"  blackHover={true}  />}
          <Button loading={logoRemove}  onClick={removeLogoButton} icon="Trash2" text={"Remove"} blackHover={true} />
          </div>
     
          </div>
        
        </div>

   
      </div>



        <button className="save-btn" onClick={handleSave}>
          {loading?<SpinningWheel size={25}/>:"Save Changes"}
        </button>
      {/* </div> */}
    </div>
  );
};

export default SuperAdminSetting;
