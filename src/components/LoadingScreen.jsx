import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingScreen.css';

const LoadingScreen = ({ isVisible = true, message = 'Caricamento...' }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className='loading-overlay'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className='loading-container'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
      >
        <motion.div
          className='loading-spinner'
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className='spinner-ring'></div>
          <div className='spinner-ring'></div>
          <div className='spinner-ring'></div>
        </motion.div>

        <motion.p
          className='loading-text'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {message}
        </motion.p>

        <motion.div
          className='loading-dots'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className='dot'
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
