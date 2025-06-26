import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MealDetailModal.css';

const MealDetailModal = ({ meal, onClose, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getTotalSugar = () => {
    return meal.foodItems
      .reduce((total, item) => total + item.sugarContent, 0)
      .toFixed(1);
  };

  const getTotalInsulin = () => {
    return meal.foodItems
      .reduce((total, item) => total + (item.insulinUnits || 0), 0)
      .toFixed(1);
  };

  const handleDelete = () => {
    onDelete(meal.id);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
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
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className='modal-overlay'
      variants={overlayVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      onClick={onClose}
    >
      <motion.div
        className='modal-container'
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
        layoutId={`meal-${meal.id}`}
      >
        <motion.div
          className='modal-header'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>{meal.name}</h2>
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
          className='modal-content'
          variants={contentVariants}
          initial='hidden'
          animate='visible'
        >
          <div className='foods-section'>
            <motion.h3 variants={itemVariants}>Contenuto del Pasto</motion.h3>
            <div className='food-list'>
              {meal.foodItems.map((food, index) => (
                <motion.div
                  key={food.id}
                  className='food-item-detail'
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className='food-main-info'>
                    <span className='food-name'>{food.name}</span>
                    <span className='food-weight'>{food.grams}g</span>
                  </div>
                  <div className='food-nutrients'>
                    <div className='nutrient-item carbs'>
                      <span className='nutrient-value'>
                        {food.sugarContent}g
                      </span>
                      <span className='nutrient-label'>CHO</span>
                    </div>
                    <div className='nutrient-item insulin'>
                      <span className='nutrient-value'>
                        {food.insulinUnits || 0}u
                      </span>
                      <span className='nutrient-label'>INS</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className='totals-summary'
            variants={itemVariants}
          >
            <div className='summary-card carbs-total'>
              <div className='summary-value'>{getTotalSugar()}g</div>
              <div className='summary-label'>Carboidrati Totali</div>
            </div>
            <div className='summary-card insulin-total'>
              <div className='summary-value'>{getTotalInsulin()}u</div>
              <div className='summary-label'>Insulina Totale</div>
            </div>
          </motion.div>

          <motion.div
            className='action-buttons'
            variants={itemVariants}
          >
            <motion.button
              className='action-button edit-button'
              onClick={() => onEdit(meal)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              ✏️ Modifica
            </motion.button>

            <AnimatePresence mode='wait'>
              {!showDeleteConfirm ? (
                <motion.button
                  className='action-button delete-button'
                  onClick={() => setShowDeleteConfirm(true)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  🗑️ Elimina
                </motion.button>
              ) : (
                <motion.div
                  className='delete-confirmation'
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <span className='confirm-text'>Eliminare il pasto?</span>
                  <div className='confirm-buttons'>
                    <motion.button
                      className='confirm-button yes'
                      onClick={handleDelete}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sì
                    </motion.button>
                    <motion.button
                      className='confirm-button no'
                      onClick={() => setShowDeleteConfirm(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      No
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MealDetailModal;
