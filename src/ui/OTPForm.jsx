import React, { useRef } from "react";

export default function OTPBoxes({ length = 6, onChange }) {
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^[0-9]?$/.test(value)) return;

    // Move to next box if a digit is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Send OTP value to parent
    const otp = inputRefs.current.map((input) => input.value).join("");
    onChange(otp);
    
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {Array.from({ length }).map((_, i) => (
        <input
        required
          key={i}
          type="text"
          maxLength="1"
          ref={(el) => (inputRefs.current[i] = el)}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          style={{
            width: "45px",
            height: "45px",
            textAlign: "center",
            fontSize: "20px",
            border: "2px solid #ccc",
            borderRadius: "8px",
          }}
        />
      ))}
    </div>
  );
}
