import React, { useEffect, useState, useRef } from 'react'
import { User } from "lucide-react"
import Button from './Button'
import Plan from './Plan' // <-- import Plan component
import "../styles/createClientForm.css"
import { updateOrg } from "../admin/api"
import { isAuthenticated } from "../auth/api"

const UpdateOrgForm = ({ onSuccess, setCreateUpdateOrg, org, setOrg }) => {
  const { user, token } = isAuthenticated();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [plan, setPlan] = useState("All Plans"); // <-- state for Plan
  const [success, setSuccess] = useState('');
  const [orgId, setOrgId] = useState('');
  const [loading, setLoading] = useState(false);
  const createdBy = user._id;
  const [error, setError] = useState(null);
  const errorRef = useRef(null);
  const successRef = useRef(null);

  const showError = () => {
    if (!error) return "";
    return (
      <div ref={errorRef} className='tasks' style={{ background: "#FF7081", padding:"10px", marginBottom:"9px", borderRadius:"10px" }}>
        <p style={{ margin: "0 auto" }}>{error}</p>
      </div>
    );
  }

  const handleChange = (name) => (event) => {
    if(name === "name") setName(event.target.value);
    else if(name === "email") setEmail(event.target.value);
    else if(name === "phone") setPhone(event.target.value);
    else if(name === "address") setAddress(event.target.value);
  }

  useEffect(() => {
    if(org && Object.keys(org).length > 0) {
      setName(org.name || '');
      setEmail(org.email || '');
      setPhone(org.phone || '');
      setAddress(org.address || '');
      setOrgId(org._id || '');
      setPlan(org.plan || "All Plans"); // <-- initialize plan from org
    }
    console.log(org)
  }, [org]);

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true);
    const data = await updateOrg(orgId, { name, email, phone, address, plan, createdBy });
    if(data.error) {
      setLoading(false);
      setSuccess(null);
      setError(data.error);
      setTimeout(() => {
        if(errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      setLoading(false);
      setError(null);
      setSuccess("Organization updated successfully ✅");
      setTimeout(() => {
        if(successRef.current) {
          successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      onSuccess();
    }
  }

  return (
    <div className="client-form-container">
      <div className="container">
        <div className="client-create-header">
          <div onClick={() => setCreateUpdateOrg(false)}>
            <Button icon='ArrowLeftIcon' backgroundColor='transparent' text="Back to Users" border='none' color='black'/>
          </div>
          <div className="info">
            <h3>Update Organization</h3>
            <p>Enter your organization information</p>
          </div>  
        </div>

        {showError()}

        <div className="basic-info">
          <div className="head">
            <p><User size={15}/> Basic Information</p>
            <p>Primary contact details</p>
          </div>
          <div className="fields">
            <div className="field">
              <label htmlFor="client-name">Organization Name</label>
              <input type="text" id='client-name' value={name} onChange={handleChange("name")} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="text" id='email' value={email} onChange={handleChange("email")} />
            </div>
            <div className="field">
              <label htmlFor="phone-no">Phone-no</label>
              <input type="text" id='phone-no' value={phone} onChange={handleChange("phone")} />
            </div>
            <div className="field">
              <label>Plan</label>
              <Plan 
                text={plan} 
                scroll={false} 
                setForm={null} 
                form={null} 
                setStatus={setPlan} 
              />
            </div>
          </div>
        </div>

        <div className="basic-info adress-info">
          <div className="head">
            <p><User size={15}/> Address Information</p>
            <p>Billing address</p>
          </div>
          <div className="fields">
            <div className="field">
              <label htmlFor="address">Full Address</label>
              <input type="text" id='address' value={address} onChange={handleChange("address")} />
            </div>
          </div>
        </div>

        <div className="btns-group">
          <div onClick={() => setCreateUpdateOrg(false)}>
            <Button backgroundColor='white' text="cancel" color='black' noIcon={true} />
          </div>
          <div onClick={handleSubmit}> 
            <Button loading={loading} border='1px solid lightgray' blackHover={true} icon='Save' text={"Save Organization"} />
          </div>
        </div>

        {success && <p ref={successRef} style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
}

export default UpdateOrgForm;
