import React, { useEffect, useState } from 'react'
import {User} from "lucide-react"
import Button from './Button'
import "../styles/createClientForm.css"
import {createOrg, updateOrg} from "../admin/api"
import {isAuthenticated} from "../auth/api"

const UpdateOrgForm = ({onSuccess ,setCreateUpdateOrg, org, setOrg}) => {
  const {user, token} = isAuthenticated();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');
  const [orgId, setOrgId] = useState('');
  const createdBy = user._id;

  const handleChange = (name) => (event) => {
    if(name == "name"){
      setName(event.target.value);
    }else if(name == "email"){
      setEmail(event.target.value);
  }else if(name == "phone"){
    setPhone(event.target.value);
  }
  else if(name == "address"){
    setAddress(event.target.value);
  }
}

useEffect(()=>{
    if( org && Object.keys(org).length > 0)
     setName(org.name || '');
    setEmail(org.email || '');
    setPhone(org.phone || '');
    setAddress(org.address || '');
    setOrgId(org._id || '')


}, [org])

const handleSubmit = async() => {
  const data =  await updateOrg(orgId ,{name, email, phone, address, createdBy});
  if(data.error){
    console.log("error", data.error);
    
  } else {
  setSuccess("Organization updated successfully ✅")
onSuccess()
  }

}

  return (
    <div className="client-form-container">
        <div className="container">
      <div className="client-create-header">
        <div onClick={()=> setCreateUpdateOrg(false)}>

        <Button icon='ArrowLeftIcon' backgroundColor='transparent' text="Back to Users" border='none' color='black'/>
        </div>
        <div className="info">
        <h3>Update Organization</h3>
        <p>Enter your organization information</p>
        </div>  
      </div>
        {/* <form> */}

       
        <div className="basic-info">
            <div className="head">
                <p> <User size={15}/> Basix Information</p>
                <p>Primary contact details</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="client-name" > Organization Name</label>
            <input type="text" id='client-name' value={name}  onChange={handleChange("name")}  />
            </div>
            <div className="field">
            <label htmlFor="email" >Email </label>
            <input type="text" id='email' value={email}onChange={handleChange("email")}  />
            </div>
            <div className="field">
            <label htmlFor="phone-no" >Phone-no </label>
            <input type="text" id='phone-no' value={phone} onChange={handleChange("phone")} />
            </div>
            </div>
        </div>

        
        <div className="basic-info adress-info">
            <div className="head">
                <p> <User size={15}/>Adress Information</p>
                <p>Billing address</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="adress" >Full Address</label>
            <input type="text" id='address' value={address} onChange={handleChange("address")} />
            </div>
           
            </div>
        </div>

        <div className="btns-group">
            <div onClick={()=> setCreateUpdateOrg(false)}>
            <Button backgroundColor='white' text="cancel" color='black' noIcon={true} />
            </div>
            <div onClick={handleSubmit}> 
            <Button border='1px solid lightgray' blackHover={true} icon='Save' text={"Save Organization"}/>
            </div>
        </div>
 {/* </form> */}
   {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
    </div>
  )
}

export default UpdateOrgForm
