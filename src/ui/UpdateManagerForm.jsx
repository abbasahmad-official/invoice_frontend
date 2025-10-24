import React, { useEffect, useState } from 'react'
import {User, Key, Lock, Eye} from "lucide-react"
import Button from './Button'
import "../styles/createClientForm.css"
import {updateUser} from "../admin/api"
import {isAuthenticated, signup} from "../auth/api"

const UpdateManagerForm = ({onSuccess ,setCreateUpdateManager, manager, updateManager}) => {
  const {user, token} = isAuthenticated();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [show, setShow] = useState(false);
  const [notMatched, setNotMatched] = useState('');
  const organization = user.organization;

  const handleChange = (name) => (event) => {
    setSuccess("")
    if(name == "name"){
      setName(event.target.value);
    }else if(name == "email"){
      setEmail(event.target.value);
  }

}

useEffect(() => {
  if (updateManager && Object.keys(updateManager).length > 0) {
    setName(updateManager.name || '');
    setEmail(updateManager.email || '');
  }
}, []);  // dependency should be updateManager, not manager


const handleSubmit = async() => {
    // console.log(updateManager)
    // const {name, email, organization, _id} = updateManager
    const userId = user._id
   
      const data =  await updateUser({name, email}, userId, token);
      if(!data){
        console.error("API returned null or undefined");
      return;
      }
      if(data.error){
          console.log("error", data.error);
        
        } else {
          console.log(data)
          setSuccess("Manager updated successfully ✅")
            
           onSuccess()
          }  
      
}

const showPassword = async(e) => {
  setShow(prev => !prev);
}

  return (
    <div className="client-form-container">
        <div className="container">
      <div className="client-create-header">
        <div onClick={()=> setCreateUpdateManager(false)}>

        <Button icon='ArrowLeftIcon' backgroundColor='transparent' text="Back to Managers" border='none' color='black'/>
        </div>
        <div className="info">
        <h3>Update Manager</h3>
        <p>Enter manager information for account creation</p>
        </div>  
      </div>
        {/* <form> */}

       
        <div className="basic-info">
            <div className="head">
                <p> <User size={15}/> Basic Information</p>
                <p>Managers's primary contact details</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="client-name" > Manager Name</label>
            <input type="text" id='client-name' value={name}  onChange={handleChange("name")}  />
            </div>
            <div className="field">
            <label htmlFor="email" >Email </label>
            <input type="text" id='email' value={email} onChange={handleChange("email")}  />
            </div>
            
            </div>
        </div>

        <div className="btns-group">
            <div onClick={()=> setCreateUpdateManager(false)}>
            <Button backgroundColor='white' text="cancel" color='black' noIcon={true} />
            </div>
            <div onClick={handleSubmit}> 
            <Button border='1px solid lightgray' blackHover={true} icon='Save' text={"Save manager"}/>
            </div>
        </div>
 {/* </form> */}
   {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
   {notMatched && <p style={{ color: "red", marginTop: "10px" }}>{notMatched}</p>}
    </div>
    </div>
  )
}

export default UpdateManagerForm
