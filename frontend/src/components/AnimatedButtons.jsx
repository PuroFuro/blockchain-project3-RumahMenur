import React from 'react';
import { motion } from 'framer-motion';

function AnimatedButton({ children, onClick, className = "" }) {
  return (
    <motion.button
      onClick={onClick}
      className={`primary-btn ${className}`}
      
      whileHover={{ 
        scale: 1.05,
      }}
      whileTap={{ 
        scale: 0.95 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;