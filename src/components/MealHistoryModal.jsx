import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MealHistoryModal.css';

const MealHistoryModal = ({ onClose }) => {
  // Sample historical data - in a real app this would come from API/database
  const [historyData] = useState([
    {
      date: '2024-01-15',
      displayDate: 'Oggi',
      totalSugar: '137.6g',
      totalInsulin: '13.9u',
      meals: [
        { name: 'Colazione', sugar: '45.2g', insulin: '4.5u' },
        { name: 'Pranzo', sugar: '38.7g', insulin: '3.9u' },
        { name: 'Merenda', sugar: '22.8g', insulin: '2.3u' },
        { name: 'Cena', sugar: '31.5g', insulin: '3.2u' },
      ],
    },
    {
      date: '2024-01-14',
      displayDate: 'Ieri',
      totalSugar: '125.3g',
      totalInsulin: '12.5u',
      meals: [
        { name: 'Colazione', sugar: '42.1g', insulin: '4.2u' },
        { name: 'Pranzo', sugar: '41.2g', insulin: '4.1u' },
        { name: 'Merenda', sugar: '18.5g', insulin: '1.9u' },
        { name: 'Cena', sugar: '23.5g', insulin: '2.3u' },
      ],
    },
    {
      date: '2024-01-13',
      displayDate: '2 giorni fa',
      totalSugar: '142.8g',
      totalInsulin: '14.3u',
      meals: [
        { name: 'Colazione', sugar: '38.9g', insulin: '3.9u' },
        { name: 'Pranzo', sugar: '52.3g', insulin: '5.2u' },
        { name: 'Merenda', sugar: '25.1g', insulin: '2.5u' },
        { name: 'Cena', sugar: '26.5g', insulin: '2.7u' },
      ],
    },
    {
      date: '2024-01-12',
      displayDate: '3 giorni fa',
      totalSugar: '118.7g',
      totalInsulin: '11.9u',
      meals: [
        { name: 'Colazione', sugar: '35.2g', insulin: '3.5u' },
        { name: 'Pranzo', sugar: '45.8g', insulin: '4.6u' },
        { name: 'Merenda', sugar: '15.3g', insulin: '1.5u' },
        { name: 'Cena', sugar: '22.4g', insulin: '2.3u' },
      ],
    },
    {
      date: '2024-01-11',
      displayDate: '4 giorni fa',
      totalSugar: '134.2g',
      totalInsulin: '13.4u',
      meals: [
        { name: 'Colazione', sugar: '41.7g', insulin: '4.2u' },
        { name: 'Pranzo', sugar: '48.5g', insulin: '4.9u' },
        { name: 'Merenda', sugar: '19.8g', insulin: '2.0u' },
        { name: 'Cena', sugar: '24.2g', insulin: '2.3u' },
      ],
    },
  ]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className='history-modal-overlay'
      variants={overlayVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      onClick={onClose}
    >
      <motion.div
        className='history-modal-container'
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div className='history-modal-header'>
          <h2>Storico Pasti</h2>
          <motion.button
            className='close-button'
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </motion.div>

        <motion.div
          className='history-modal-content'
          variants={itemVariants}
        >
          {historyData.map((day, index) => (
            <motion.div
              key={day.date}
              className='day-section'
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className='day-header'>
                <h3>{day.displayDate}</h3>
                <div className='day-totals'>
                  <span className='total-sugar'>{day.totalSugar} zuccheri</span>
                  <span className='total-insulin'>
                    {day.totalInsulin} insulina
                  </span>
                </div>
              </div>

              <div className='day-meals'>
                {day.meals.map((meal, mealIndex) => (
                  <motion.div
                    key={mealIndex}
                    className='history-meal-item'
                    whileHover={{ x: 5 }}
                  >
                    <span className='meal-name'>{meal.name}</span>
                    <div className='meal-values'>
                      <span className='meal-sugar'>{meal.sugar}</span>
                      <span className='meal-insulin'>{meal.insulin}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MealHistoryModal;
