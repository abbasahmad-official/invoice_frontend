import React, { useState } from 'react'
import {User, Key, Lock, Eye} from "lucide-react"
import Button from './Button'
import "../styles/createClientForm.css"
import {createOrg} from "../admin/api"
import {isAuthenticated} from "../auth/api"

const CreateOrgForm = ({onSuccess ,setCreateOrg}) => {
  const {user, token} = isAuthenticated();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');
  const[newPassword, setNewPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false);
  const [notMatched, setNotMatched] = useState('');
  const createdBy = user._id;

  const handleChange = (name) => (event) => {
    setSuccess("")
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
  else if(name == "newPassword"){
    setNewPassword(event.target.value);
  }
  else if(name == "confirmPassword"){
    setConfirmPassword(event.target.value);
  }
}

const handleSubmit = async() => {
  if(newPassword.length >0 && confirmPassword.length > 0 ){
    if(newPassword == confirmPassword){
      
      const data =  await createOrg({name, email, phone, address, createdBy, newPassword}, token);
      if(data.error){
          console.log("error", data.error);
        
        } else {
          console.log(data)
          setSuccess("Organization created successfully ✅")
            setAddress("")
            setEmail("");
            setName("");
           setPhone("");
           setNewPassword("");
           setConfirmPassword("");
           onSuccess()
          }
        } else {
          setNotMatched("Password does not match")
          console.log("password does not match")
        }
      } else {
        console.log("no password entered")
      }

}

const showPassword = async(e) => {
  setShow(prev => !prev);
}

  return (
    <div className="client-form-container">
        <div className="container">
      <div className="client-create-header">
        <div onClick={()=> setCreateOrg(false)}>

        <Button icon='ArrowLeftIcon' backgroundColor='transparent' text="Back to Users" border='none' color='black'/>
        </div>
        <div className="info">
        <h3>Add New Organization</h3>
        <p>Enter client information for invoicing</p>
        </div>  
      </div>
        {/* <form> */}

       
        <div className="basic-info">
            <div className="head">
                <p> <User size={15}/> Basic Information</p>
                <p>Client's primary contact details</p>
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
                <p> <User size={15}/> Adress Information</p>
                <p>Client's billing address</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="adress" >Full Address</label>
            <input type="text" id='address' value={address} onChange={handleChange("address")} />
            
            </div>
           
            </div>
        </div>
     
        <div className="basic-info">
            <div className="head">
                <p> <Lock size={15}/> Password</p>
                <p >Create strong security</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="newPassword" >New Password</label>
             <div className='password' style={{position: "relative"}}>
            <input type={show ? "text" :"password"} id='newPassword'  value={newPassword} onChange={handleChange("newPassword")} />
            <Eye size={15} style={{position:"absolute", right:"5", top: "5", cursor:"pointer" }} onClick={showPassword} />
            </div>
            </div>
            <div className="field">
            <label htmlFor="confirmPassword" >Confirm Password</label>
            <div className='password' style={{position: "relative"}}>
            <input type={show ? "text" :"password"} id='confirmPassword' value={confirmPassword} onChange={handleChange("confirmPassword")}  />
            <Eye size={15} style={{position:"absolute", right:"5", top: "5", cursor:"pointer" }} onClick={showPassword} />
            </div>
            </div>
           
            </div>
        </div>

        <div className="btns-group">
            <div onClick={()=> setCreateOrg(false)}>
            <Button backgroundColor='white' text="cancel" color='black' noIcon={true} />
            </div>
            <div onClick={handleSubmit}> 
            <Button border='1px solid lightgray' blackHover={true} icon='Save' text={"Save Organization"}/>
            </div>
        </div>
 {/* </form> */}
   {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
   {notMatched && <p style={{ color: "red", marginTop: "10px" }}>{notMatched}</p>}
    </div>
    </div>
  )
}

export default CreateOrgForm
