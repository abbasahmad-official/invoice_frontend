import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  UserCog,
  Menu,
  X,
  Car,
  Settings,
} from "lucide-react";
import "./styles/home.css";
import Button from "./ui/Button";
import SearchBar from "./ui/Search";
import Dropdown from "./ui/Dropdown";
import Dashboard from "./userComponents/Dashboard";
import Invoice from "./userComponents/Invoice";
import Clients from "./userComponents/Clients";
import Products from "./userComponents/Products";
import Card from "./ui/Card";
import { isAuthenticated, signout } from "./auth/api";
import { getLogo } from "./admin/api";
import { API } from "./config";
import ManagerSettings from "./userComponents/ManagerSettings";

const UserHome = () => {
  const panelRef = useRef(null);
  const {user, token} =isAuthenticated();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1016);
  const [isPanelOpen, setIsPanelOpen] = useState(!isMobile);
  const [directLink, setDirectLink] = useState("");
  const[logo, setLogo] = useState({})
  
  const navigate = useNavigate()

  useEffect(()=>{
    const handleClickOutside  = (event) => {
      if(isMobile && isPanelOpen && panelRef.current && panelRef.current.contains(event.target)){
        setIsPanelOpen(false)
      }
    }

   document.addEventListener("mousedown", handleClickOutside);

   return  () => {
    document.removeEventListener("mousedown", handleClickOutside)
   }

  },[isMobile, isPanelOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1016) {
        setIsMobile(true);
        setIsPanelOpen(false); // closed by default on mobile
      } else {
        setIsMobile(false);
        setIsPanelOpen(true); // always open on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    useEffect(()=>{
  fetchLogo()
    },[])
  
  const fetchLogo = async()=>{
    const data  = await getLogo(user.organization, token)
    if(data.error && data.status== 404){
      console.log(data.error)
    } else {
      // console.log(data)
      setLogo(data)
    }
  }

  const isActive = (path) => ({
    backgroundColor: activeSection === path ? "#dde2f6ff" : "#ffffff",
  });

  const logout = () => {
      signout(token ,()=>{
        navigate("/login")
      })
    }

    const refreshLogo = async () => {
      const data = await getLogo(user._id, token);
      if (!data.error) {
        setLogo(data);
      }
    };
    

  return (
    <div className="box">
      {/* Menu icon (mobile only) */}
      {isMobile && (
        <div className="menu-icon" onClick={() => setIsPanelOpen(true)}>
           <Menu />
        </div>
      )}

      {/* Overlay (click to close on mobile) */}
      {isMobile && isPanelOpen && (
        <div className="overlay" onClick={() => setIsPanelOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div ref={panelRef} className={`side-panel ${isPanelOpen ? "show" : ""}`}>
        <div className="side-panel-header gap">
          <div className="logo">
            <img src={logo?.path ? API + logo.path : "./logo-invoice.png"} alt="my logo" width={50}/>
          </div>
          <div className="info">
            <p>{logo?.companyName || "SimplyBill"}</p>
            <p>Invoice Management</p>
          </div>
          {isMobile && <div className="close" onClick={() => setIsPanelOpen(false)}>
          <X width={15} />
          </div>}
        </div>

        <div className="side-panel-user gap">
          <div className="user">
            <UserCog size={50} color="purple" />
          </div>
          <div className="info">
            <p>{user.name}</p>
            <p>{user.email}</p>
             <div onClick={logout} style={{marginTop: "10px",marginLeft:"10px", textAlign: "center"}}>
          <Button  blackHover={true} text={"logout"} icon="LogOut" backgroundColor="black" hover={"off"}/>
            </div>
          </div>
          
        </div>

        <div className="features gap">
          <div
            className="feature gap"
            style={isActive("dashboard")}
            onClick={() => {setActiveSection("dashboard")
              setIsPanelOpen(false)
            }
            }
          >
            <div className="icon">
              <LayoutDashboard />
            </div>
            <p>Dashboard</p>
          </div>
          <div
            className="feature gap"
            style={isActive("invoices")}
            onClick={() => {setActiveSection("invoices")
              setIsPanelOpen(false)
            }}
          >
            <div className="icon">
              <FileText />
            </div>
            <p>Invoices</p>
          </div>
          <div
            className="feature gap"
            style={isActive("clients")}
            onClick={() => {setActiveSection("clients")
              setIsPanelOpen(false)
            }}
          >
            <div className="icon">
              <Users />
            </div>
            <p>Clients</p>
          </div>
          <div
            className="feature gap"
            style={isActive("products")}
            onClick={() => {setActiveSection("products")
              setIsPanelOpen(false)
            }}
          >
            <div className="icon">
              <Package />
            </div>
            <p>Products</p>
          </div>
          <div
            className="feature gap"
            style={isActive("setting")}
            onClick={() => {setActiveSection("setting")
              setIsPanelOpen(false)
            }}
          >
            <div className="icon">
              <Settings />
            </div>
            <p>Setting</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="data-container">
        {activeSection === "dashboard" && <Dashboard directLink={directLink}  setDirectLink={setDirectLink} setActiveSection={setActiveSection} activeSection={activeSection}/>}
        {activeSection === "invoices" && <Invoice directLink={directLink} setDirectLink={setDirectLink} activeSection={activeSection}/>}
        {activeSection === "clients" && <Clients  directLink={directLink} setDirectLink={setDirectLink} activeSection={activeSection}/>}
        {activeSection === "products" && <Products directLink={directLink} setDirectLink={setDirectLink} activeSection={activeSection} />}
        {activeSection === "setting" && <ManagerSettings directLink={directLink} setDirectLink={setDirectLink} activeSection={activeSection} refreshLogo={refreshLogo} />}
      </div>
    </div>
  );
};

export default UserHome;
