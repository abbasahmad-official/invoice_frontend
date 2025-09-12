import React from 'react';
import {AlignCenter, Check} from "lucide-react"


const Success = ({ message }) => {
  return (
    <div style={styles.container}>
      <Check size={20} color="white" style={{ marginRight: 8 }} />
      <span>{message}</span>
    </div>
  );
};

const styles = {
container: {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#4BB543', // nice green for success
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 1000,
  minWidth: '300px',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',      // vertically center
  justifyContent: 'center',  // horizontally center
  gap: '8px',                // space between icon and text
},
  message: {
    margin: 0,
  },
};

export default Success;
