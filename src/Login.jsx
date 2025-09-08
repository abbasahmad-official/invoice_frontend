import React, {useEffect, useState} from 'react'
import {Navigate, useNavigate} from "react-router-dom"
import './styles/login.css'
import {FileText, Users, TrendingUp} from "lucide-react"
import {signup, signin, authenticate, isAuthenticated} from "./auth/api"

const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [isActive, setIsActive] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(false);

    useEffect(()=>{
      isAuthenticated() && navigate("/")
    }, [])

    const adminEmail = "admin@gmail.com" 
    const adminPassword = "admin123/" 
    const userEmail = "user@gmail.com" 
    const userPassword = "user123/" 

    const handleClick = (mode) => { 
        setMode(mode)
    };

    const handleDemoUse = (role) => {
        if(role === "admin"){
            // populate with admin credentials
            setEmail(adminEmail)
            setPassword(adminPassword)
            // alert("Admin credentials used")
        } else {
            // populate with user credentials
            setEmail(userEmail)
            setPassword(userPassword)
            // alert("User credentials used")
        }
    }
 const handleChange = (field) => (event) => {
    const value = event.target.value;
    if(field === "email") setEmail(value);
    else if(field === "password") setPassword(value);
    else if(field === "name") setName(value);

    // console.log({email, password, name});
    };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (mode === "register") {
    try {
      const data = await signup({ name, email, password });

      if (data.error) {
        setError(data.error)
        // console.log(data.error);
        return;
      }

      console.log(data);
      setMode("login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  } else if (mode === "login") {
    try {
      const data = await signin({ email, password });

      if (data.error) {
        console.log(data.error);
      } else {
        authenticate(data, ()=>{
            navigate("/");
        })
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }
};

  return (
    <div className='login'>
        <div className="form">
            <div className="info">
                <div className="logo"><FileText color='white' /></div>
                <div className="after-logo">
                    <h3>InvoiceSys</h3>
                    <p>Professional Invoice Management</p>
                </div>
            </div>
            <div className="tasks">
                <div className="task">
                    <div className="logo"><FileText color='purple' style={{flexShrink: 0}} /></div>
                    <p>Create Invoices</p>
                </div>
          
                <div className="task">
                    <div className="logo"><Users  color='green' style={{flexShrink: 0}} /></div>
                    <p>Manage Clients</p>
                </div>
            
            
                <div className="task">
                    <div className="logo"><TrendingUp color='blue' style={{flexShrink: 0}} /></div>
                    <p>Track Revenue</p>
                </div>
            </div>

            <div className="demo-credentials">
                <h4>Demo Credentials</h4>
                <p>Use these credentials to test different user roles</p>
                <div className="role">
                    <div className="admin">
                        <div className="left">
                            <p>{adminEmail}</p>
                            <p>Admin (Full Access)</p>
                        </div>
                        <button className="login-btn" onClick={()=> handleDemoUse("admin")} >Use</button>
                    </div>
                    <div className="admin user">
                        <div className="left">
                            <p>{userEmail}</p>
                            <p>User (Limited Access)</p>
                        </div>
                        <button className="login-btn" onClick={()=> handleDemoUse("user")} >Use</button>
                    </div>
                </div>
            </div>

            <div className="main-form">
                <div className="btns">
                    <button className={`login-btn ${mode == "login" && "active"}`} onClick={()=> handleClick("login")}  >Login</button>
                    <button className={`register-btn login-btn ${mode == "register" && "active"}`} onClick={()=> handleClick("register")} >Register</button>
                </div>
                <form onSubmit={handleSubmit}>
                {mode==="login" ? <div className="inputs">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='Email' value={email} onChange={handleChange("email")} className='input-login' />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder='Password' value={password} className='input-login' onChange={handleChange("password")} />
                    <button className="submit">Login</button>
                </div>
                : <div className="inputs">
                    <label htmlFor="Name">Full Name</label>
                    <input type="text" placeholder='Name' value={name} onChange={handleChange("name")} className='input-login'  />
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='Email'value={email}  onChange={handleChange("email")} className='input-login' />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder='Password'value={password} className='input-login' onChange={handleChange("password")}  />
                    <button className="submit">Register</button>
                </div>
                }
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login
