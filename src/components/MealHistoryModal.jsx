import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MealHistoryModal.css';

const MealHistoryModal = ({ onClose }) => {
  // Sample historical data - in a real app this would come from API/database
  const [historyData] = useState([
    {
      date: '2025-06-15',
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

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'day'
  const [expandedMeal, setExpandedMeal] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const hasDataForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return historyData.some((day) => day.date === dateString);
  };

  const getDataForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return historyData.find((day) => day.date === dateString);
  };

  const handleDateClick = (date) => {
    const dayData = getDataForDate(date);
    if (dayData) {
      setSelectedDate(dayData);
      setViewMode('day');
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleMealClick = (mealIndex) => {
    setExpandedMeal(expandedMeal === mealIndex ? null : mealIndex);
  };

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
          <h2>
            {viewMode === 'calendar' ? 'Calendario Pasti' : 'Storico Pasti'}
          </h2>
          {viewMode === 'day' && (
            <motion.button
              className='back-button'
              onClick={() => setViewMode('calendar')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Calendario
            </motion.button>
          )}
          {viewMode === 'calendar' && (
            <motion.button
              className='close-button'
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          )}
        </motion.div>

        <motion.div className='history-modal-content'>
          <AnimatePresence mode='wait'>
            {viewMode === 'calendar' ? (
              <motion.div
                key='calendar'
                className='calendar-view'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className='calendar-header'>
                  <motion.button
                    className='month-nav'
                    onClick={() => navigateMonth(-1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ←
                  </motion.button>
                  <h3>
                    {currentMonth.toLocaleDateString('it-IT', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h3>
                  <motion.button
                    className='month-nav'
                    onClick={() => navigateMonth(1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    →
                  </motion.button>
                </div>

                <div className='calendar-weekdays'>
                  {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(
                    (day) => (
                      <div
                        key={day}
                        className='weekday'
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className='calendar-grid'>
                  {getDaysInMonth(currentMonth).map((date, index) => {
                    const isCurrentMonth =
                      date.getMonth() === currentMonth.getMonth();
                    const hasData = hasDataForDate(date);
                    const isToday =
                      date.toDateString() === new Date().toDateString();

                    return (
                      <motion.div
                        key={index}
                        className={`calendar-day ${
                          !isCurrentMonth ? 'other-month' : ''
                        } ${hasData ? 'has-data' : ''} ${
                          isToday ? 'today' : ''
                        }`}
                        onClick={() => isCurrentMonth && handleDateClick(date)}
                        whileHover={
                          isCurrentMonth && hasData ? { scale: 1.1 } : {}
                        }
                        whileTap={
                          isCurrentMonth && hasData ? { scale: 0.95 } : {}
                        }
                      >
                        <span className='day-number'>{date.getDate()}</span>
                        {hasData && <div className='meal-dot'></div>}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key='day'
                className='day-view'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {selectedDate && (
                  <motion.div
                    className='day-section'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className='day-header'>
                      <h3>{formatDate(new Date(selectedDate.date))}</h3>
                      <div className='day-totals'>
                        <span className='total-sugar'>
                          {selectedDate.totalSugar} zuccheri
                        </span>
                        <span className='total-insulin'>
                          {selectedDate.totalInsulin} insulina
                        </span>
                      </div>
                    </div>

                    <div className='day-meals'>
                      {selectedDate.meals.map((meal, mealIndex) => (
                        <motion.div
                          key={mealIndex}
                          className='history-meal-item'
                          whileHover={{ x: 5 }}
                        >
                          <motion.div
                            className='meal-summary'
                            onClick={() => handleMealClick(mealIndex)}
                            whileHover={{
                              backgroundColor: 'rgba(76, 175, 80, 0.05)',
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className='meal-name'>{meal.name}</span>
                            <div className='meal-values'>
                              <span className='meal-sugar'>{meal.sugar}</span>
                              <span className='meal-insulin'>
                                {meal.insulin}
                              </span>
                            </div>
                            <motion.span
                              className='dropdown-arrow'
                              animate={{
                                rotate: expandedMeal === mealIndex ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              ▼
                            </motion.span>
                          </motion.div>

                          <AnimatePresence>
                            {expandedMeal === mealIndex && (
                              <motion.div
                                className='meal-dropdown'
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className='meal-details'>
                                  <h4>Contenuto del pasto:</h4>
                                  <div className='meal-content'>
                                    <div className='content-item'>
                                      <span className='content-label'>
                                        Pasta al pomodoro
                                      </span>
                                      <span className='content-value'>
                                        80g (CHO: 24g)
                                      </span>
                                    </div>
                                    <div className='content-item'>
                                      <span className='content-label'>
                                        Parmigiano
                                      </span>
                                      <span className='content-value'>
                                        20g (CHO: 0.6g)
                                      </span>
                                    </div>
                                    <div className='content-item'>
                                      <span className='content-label'>
                                        Pane
                                      </span>
                                      <span className='content-value'>
                                        50g (CHO: 25g)
                                      </span>
                                    </div>
                                  </div>
                                  <div className='meal-totals-detail'>
                                    <div className='total-row'>
                                      <span>Totale Carboidrati:</span>
                                      <span className='total-value'>
                                        {meal.sugar}
                                      </span>
                                    </div>
                                    <div className='total-row'>
                                      <span>Insulina Somministrata:</span>
                                      <span className='total-value'>
                                        {meal.insulin}
                                      </span>
                                    </div>
                                    <div className='total-row'>
                                      <span>Rapporto I:CHO:</span>
                                      <span className='total-value'>1:10</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MealHistoryModal;
