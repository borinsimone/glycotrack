import React from 'react';
import { motion } from 'framer-motion';
import '../styles/MealList.css';

const MealList = ({ meals, onMealClick }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className='meal-list'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {meals.map((meal, index) => (
        <motion.div
          key={meal.id}
          className='meal-item'
          variants={itemVariants}
          onClick={() => onMealClick(meal)}
        >
          <div className='meal-name'>{meal.name}</div>
          <div className='meal-sugar'>Zuccheri - {meal.sugarLevel}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MealList;
