import React, { useRef, useState } from 'react'
import {User} from "lucide-react"
import Button from './Button'
import "../styles/createClientForm.css"
import {createClient} from "../admin/api"
import {isAuthenticated} from "../auth/api"

const CreateClientForm = ({onSuccess ,setCreateClient}) => {
  const {user, token} = isAuthenticated();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef(null)
 const successRef  = useRef(null)
  const createdBy = user._id;
  

const showError = () => {
  if (!error) return ""

return <div ref={errorRef} className='tasks' style={{background: "#FF7081", padding:"10px", marginBottom:"9px",borderRadius:"10px"}}>
   <p style={{margin: "0 auto"}}>{error}</p>
</div>
}

  const handleChange = (name) => (event) => {
     setError("")
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
}

const handleSubmit = async() => {
  setLoading(true)
  const data =  await createClient({name, email, phone, address, createdBy, organization: user.organization}, token);
  if(data.error){
    setLoading(false)
    setSuccess(null)
    // console.log("error", data.error);
    setError(data.error)
         setTimeout(() => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
  } else {
    setLoading(false)
    setError(null)
  setSuccess("client created successfully ✅")
    setAddress("")
    setEmail("");
    setName("");
   setPhone("");
        setTimeout(() => {
    if (successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
   onSuccess()
  }

}

  return (
    <div className="client-form-container">
        <div className="container">
      <div className="client-create-header">
        <div onClick={()=> setCreateClient(false)}>

        <Button icon='ArrowLeftIcon' backgroundColor='transparent' text="Back to Clients" border='none' color='black'/>
        </div>
        <div className="info">
        <h3>Add New Client</h3>
        <p>Enter client information for invoicing</p>
        </div>  
      </div>
        {/* <form> */}

       
        <div className="basic-info">
          {showError()}
            <div className="head">
                <p> <User size={15}/> Basix Information</p>
                <p>Client's primary contact details</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="client-name" > client name</label>
            <input type="text" id='client-name' value={name}  onChange={handleChange("name")}  />
            </div>
            <div className="field">
            <label htmlFor="email" >email </label>
            <input type="text" id='email' value={email}onChange={handleChange("email")}  />
            </div>
            <div className="field">
            <label htmlFor="phone-no" >phone-no </label>
            <input type="text" id='phone-no' value={phone} onChange={handleChange("phone")} />
            </div>
            </div>
        </div>

        
        <div className="basic-info adress-info">
            <div className="head">
                <p> <User size={15}/>Adress Information</p>
                <p>Client's billing address</p>
            </div>
            <div className="fields">
            <div className="field">
            <label htmlFor="adress" >Full Address</label>
            <input type="text" id='address' value={address} onChange={handleChange("address")} />
            </div>
           
            </div>
        </div>

        <div className="btns-group">
            <div onClick={()=> setCreateClient(false)}>
            <Button backgroundColor='white' text="cancel" color='black' noIcon={true} />
            </div>
            <div onClick={handleSubmit}> 
            <Button loading={loading} border='1px solid lightgray' blackHover={true} icon='Save' text={"Save Client"}/>
            </div>
        </div>
 {/* </form> */}
   {success && <p ref={successRef} style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
    </div>
  )
}

export default CreateClientForm
