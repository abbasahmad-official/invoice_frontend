import React from "react";
import { data, useNavigate } from "react-router-dom";
import { signout } from "./auth/api";

const Suspended = () => {
  const navigate = useNavigate();

  const handleLogin = async() => {
    await signout(()=> {
        console.log("signout")
        navigate("/login")
    })
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #f8d7da, #f5c6cb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "white",
          padding: "50px 40px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          maxWidth: "400px",
        }}
      >
        <div style={{ fontSize: "80px", color: "#dc3545", marginBottom: "20px" }}>
          ⚠️
        </div>
        <h1 style={{ color: "#dc3545", marginBottom: "15px" }}>Account Suspended</h1>
        <p style={{ color: "#555", fontSize: "16px", lineHeight: 1.6, marginBottom: "25px" }}>
          Your account has been temporarily suspended. Please contact support or wait until the suspension is lifted.
        </p>
        <button
          onClick={handleLogin}
          style={{
            padding: "12px 25px",
            fontSize: "16px",
            color: "white",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
        >
          Signout
        </button>
      </div>
    </div>
  );
};

export default Suspended;
