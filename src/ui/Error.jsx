import React, { useEffect, useState } from 'react';
import { XCircle } from "lucide-react"; // red error icon

const Error = ({ message }) => {
  const [visible, setVisible] = useState(true);

  // Hide after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <XCircle size={20} color="white" style={{ marginRight: 8 }} />
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
    backgroundColor: '#FF4D4F', // red for error
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default Error;
