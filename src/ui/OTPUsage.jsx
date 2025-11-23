import React, { Fragment, useEffect, useRef, useState } from "react";
import OTPBoxes from "./OTPForm";
import Button from "./Button";
import { forgotPassword, verifyOTP } from "../admin/api";
import {Eye, Lock, EyeOff} from "lucide-react"
import SpinningWheel from "./SpinningWheel";
import { useNavigate } from "react-router-dom";
import Success from "./Success";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [submitEmailCheck, setSubmitEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess]= useState(null)
  const [error, setError]= useState(null)
  const [loading, setLoading] = useState(false)
  const [resendloading, setResendLoading] = useState(false)
  const [resend, setResend] = useState(false)
  const [time, setTime] = useState(null)
  const [disappear, setDisappear] = useState(null)
  const [message, setMessage] = useState(null)
  const [hide, setHide] = useState(false)
  const navigate = useNavigate()
  const passwordRef = useRef()

      const showError = () => {
  if (!error) return ""

return <div  className='tasks' style={{background: "#FF7081", padding:"10px", marginBottom:"9px",borderRadius:"10px"}}>
   <p style={{margin: "0 auto"}}>{error}</p>
</div>
}

const passwordVisibility = ()=>{
  if(!hide){
    passwordRef.current.type= "text"
    setHide(prev => !prev)
  } else{
    passwordRef.current.type = "password"
    setHide(prev => !prev)
  }
}

  // ---------------- EMAIL HANDLER ----------------
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true)
    const data = await forgotPassword({ email });
    if (data.error) {
      // console.log(data.error);
      setError(data.error)
      setLoading(false)
    } else {
      setError(null)
      // console.log(data.user);
      setMessage(data.message)
       setResend(true)
      setTimeout(()=>{
        setResend(false)
         setMessage(null)
      },1000)
      setSubmitEmail(true);
      setLoading(false)
    }
  };

  
  
  // ---------------- OTP + PASSWORD HANDLER ----------------
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    setLoading(true)

    const data = await verifyOTP({ email, newPassword, otp });
    if (data.error) {
      console.log(data.error);
      setError(data.error)
        setLoading(false)
    } else {
        setSuccess(data.message)
        navigate("/")
            setLoading(false)
    //   console.log(data.message);
    }
  };

  const resendOTP = async() => {
    setResendLoading(true)
    setResend(false)
      const data = await forgotPassword({ email });
    if (data.error) {
      console.log(data.error);
      setResendLoading(false)
    } else {
      // console.log(data.user);
      setMessage(data.message)
      setResendLoading(false)
      setResend(true)
      setTimeout(()=>{
        setResend(false)
        setMessage(null)
      },1000)
      setTime(120)
      setDisappear(true)
    }
  }

  useEffect(() => {
  if (submitEmailCheck) {
    setTime(60);        // 2 minutes
    setDisappear(true);  // hide resend button
  }
}, [submitEmailCheck]);

useEffect(() => {
  let interval = null;

  if (disappear && time > 0) {
    interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
  }

  if (time === 0) {
    setDisappear(false);  // show resend button again
  }

  return () => clearInterval(interval);
}, [time, disappear]);




  return (
    <Fragment>
      {resend  && <Success message={message}/>}
      <div
        style={{
        //   width: "320px",
          minWidth:"320px",
          maxWidth:"fit-content",
          margin: "40px auto",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        {!submitEmailCheck ? (
          // ---------------- EMAIL FORM ----------------
          
          <form onSubmit={submitEmail}>
            {showError()}
            <h2 style={{ marginBottom: "10px" }}>Reset Password</h2>

            <div className="inputs" style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="email">Email</label>

              <input
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChangeEmail}
                className="input-login"
              />

              <p style={{ fontSize: "13px", color: "gray", marginTop: "4px" }}>
                An OTP will be sent to your email.
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Button loading={loading} text={"Send OTP"} noIcon="false" blackHover={true} />
              </div>
            </div>
          </form>
          
        ) : (
          // ---------------- OTP FORM ----------------
          <>
          {showError()}
          <form onSubmit={handleOTP}>
            <h2 style={{ marginBottom: "5px" }}>Enter OTP</h2>
            <p style={{ fontSize: "13px", color: "gray" }}>
              The OTP expires in 10 minutes.
            </p>

            <div style={{ marginTop: "15px", marginBottom: "15px" }}>
              <OTPBoxes length={6} onChange={setOtp} />
            </div>

            <label htmlFor="password" style={{ marginTop: "10px" }}>
              New Password
            </label>
            <div style={{position:"relative"}}>
            <input
            ref={passwordRef}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                marginTop: "5px",
              }}
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handlePasswordChange}
              className="input-login"
            />
              { !hide?<EyeOff onClick={passwordVisibility}  style={{position:"absolute", right:"5", top:"50%", transform:"translateY(-68%)", cursor:"pointer"}} size={15}/>
                    :<Eye onClick={passwordVisibility} style={{position:"absolute", right:"5", top:"50%", transform:"translateY(-68%)", cursor:"pointer"}} size={15}/>}
            </div>
             {disappear?<div style={{display:"flex", justifyContent:"flex-end"}}><p>Resend again after {time}s</p></div>:<div style={{display:"flex", justifyContent:"flex-end"}}>
                        {resendloading?<SpinningWheel size={25}/>:
                        <a className='forget-button' onClick={resendOTP}>Resend?</a>}
                    </div>}

            {loading? <SpinningWheel size={25}/>:<button
              type="submit"
              style={{
                cursor: "pointer",
                marginTop: "15px",
                padding: "10px",
                width: "100%",
                backgroundColor: "#4FA4FF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Submit
            </button>}
          </form>
          </>
        )}
        
      </div>
    </Fragment>
  );
}
