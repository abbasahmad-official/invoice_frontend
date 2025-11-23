import React from "react";
import "../styles/spinningWheel.css";

export default function SpinningWheel({ size = 40, color = "#3498db" }) {
  const style = {
    width: size,
    height: size,
    borderColor: `${color} transparent transparent transparent`

  };

  return <div className="spinner" style={style}></div>;
}
