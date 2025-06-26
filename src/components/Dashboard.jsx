import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Dashboard.css';
import AddMealForm from './AddMealForm';
import MealList from './MealList.jsx';
import MealDetailModal from './MealDetailModal.jsx';
import EditMealModal from './EditMealModal.jsx';
import SettingsModal from './SettingsModal.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import MealHistoryModal from './MealHistoryModal.jsx';
import StatisticsModal from './StatisticsModal.jsx';
import { GiMeal } from 'react-icons/gi';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Colazione',
      sugarLevel: '45.2g',
      insulinUnits: '4.5u',
      foodItems: [
        {
          id: 1,
          name: 'Cornetti',
          grams: 80,
          sugarContent: 18.5,
          carbContent: 18.5,
          insulinUnits: 1.9,
        },
        {
          id: 2,
          name: 'Marmellata',
          grams: 30,
          sugarContent: 16.2,
          carbContent: 16.2,
          insulinUnits: 1.6,
        },
        {
          id: 3,
          name: 'Latte',
          grams: 200,
          sugarContent: 10.5,
          carbContent: 10.5,
          insulinUnits: 1.0,
        },
      ],
    },
    {
      id: 2,
      name: 'Pranzo',
      sugarLevel: '38.7g',
      insulinUnits: '3.9u',
      foodItems: [
        {
          id: 4,
          name: 'Pasta',
          grams: 100,
          sugarContent: 25.3,
          carbContent: 25.3,
          insulinUnits: 2.5,
        },
        {
          id: 5,
          name: 'Pomodoro',
          grams: 150,
          sugarContent: 8.2,
          carbContent: 8.2,
          insulinUnits: 0.8,
        },
        {
          id: 6,
          name: 'Parmigiano',
          grams: 20,
          sugarContent: 5.2,
          carbContent: 5.2,
          insulinUnits: 0.6,
        },
      ],
    },
    {
      id: 3,
      name: 'Merenda',
      sugarLevel: '22.8g',
      insulinUnits: '2.3u',
      foodItems: [
        {
          id: 7,
          name: 'Mela',
          grams: 120,
          sugarContent: 14.5,
          carbContent: 14.5,
          insulinUnits: 1.5,
        },
        {
          id: 8,
          name: 'Biscotti',
          grams: 25,
          sugarContent: 8.3,
          carbContent: 8.3,
          insulinUnits: 0.8,
        },
      ],
    },
    {
      id: 4,
      name: 'Cena',
      sugarLevel: '31.5g',
      insulinUnits: '3.2u',
      foodItems: [
        {
          id: 9,
          name: 'Riso',
          grams: 80,
          sugarContent: 20.2,
          carbContent: 20.2,
          insulinUnits: 2.0,
        },
        {
          id: 10,
          name: 'Verdure',
          grams: 100,
          sugarContent: 6.8,
          carbContent: 6.8,
          insulinUnits: 0.7,
        },
        {
          id: 11,
          name: 'Pesce',
          grams: 150,
          sugarContent: 4.5,
          carbContent: 4.5,
          insulinUnits: 0.5,
        },
      ],
    },
  ]);

  const handleAddMeal = async (newMeal) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMeals([...meals, { ...newMeal, id: Date.now() }]);
    setShowAddMealForm(false);
    setIsLoading(false);
  };

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter((meal) => meal.id !== mealId));
    setSelectedMeal(null);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setSelectedMeal(null);
  };

  const handleUpdateMeal = (updatedMeal) => {
    setMeals(
      meals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal))
    );
    setEditingMeal(null);
  };

  const getDailyTotalSugar = () => {
    return meals
      .reduce((total, meal) => {
        const mealSugar = parseFloat(meal.sugarLevel.replace('g', ''));
        return total + mealSugar;
      }, 0)
      .toFixed(1);
  };

  const getDailyTotalInsulin = () => {
    return meals
      .reduce((total, meal) => {
        const mealInsulin = parseFloat(meal.insulinUnits.replace('u', ''));
        return total + mealInsulin;
      }, 0)
      .toFixed(1);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen message='Salvando pasto...' />}
      </AnimatePresence>

      <motion.div
        className='dashboard'
        initial='initial'
        animate='in'
        exit='out'
        variants={pageVariants}
        transition={pageTransition}
      >
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='dashboard-content'
        >
          <motion.div
            className='header'
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className='user-greeting'>
              <motion.span
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Ciao, {currentUser?.displayName || 'User'}
              </motion.span>
              <motion.div
                className='user-avatar'
                onClick={() => setShowSettings(true)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                {currentUser?.displayName
                  ? currentUser.displayName[0].toUpperCase()
                  : 'S'}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className='add-button-container'
            variants={itemVariants}
          >
            <motion.button
              className='add-button'
              onClick={() => setShowAddMealForm(true)}
              whileHover={{
                scale: 1.05,
                rotate: [0, -5, 5, 0],
                transition: { rotate: { duration: 0.3 } },
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.6,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <GiMeal
                  className='add-icon'
                  size={60}
                />
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.button
            className='statistics-button'
            onClick={() => setShowStatistics(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            variants={itemVariants}
          >
            Mostra Statistiche
          </motion.button>

          <motion.div
            className='meals-section'
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div
              className='meals-header'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h2>Pasti di Oggi</h2>
              <div className='daily-totals'>
                <div className='total-item sugar'>
                  <span className='total-value'>{getDailyTotalSugar()}g</span>
                  <span className='total-label'>Carboidrati</span>
                </div>
                <div className='total-item insulin'>
                  <span className='total-value'>{getDailyTotalInsulin()}u</span>
                  <span className='total-label'>Insulina</span>
                </div>
              </div>
            </motion.div>

            <div className='meals-list-container'>
              <MealList
                meals={meals}
                onMealClick={handleMealClick}
              />
            </div>

            <motion.button
              className='show-more-button'
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={() => setShowHistory(true)}
            >
              Visualizza Storico
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode='wait'>
          {showAddMealForm && (
            <AddMealForm
              onAddMeal={handleAddMeal}
              onClose={() => setShowAddMealForm(false)}
            />
          )}

          {selectedMeal && (
            <MealDetailModal
              meal={selectedMeal}
              onClose={() => setSelectedMeal(null)}
              onDelete={handleDeleteMeal}
              onEdit={handleEditMeal}
            />
          )}

          {editingMeal && (
            <EditMealModal
              meal={editingMeal}
              onUpdate={handleUpdateMeal}
              onClose={() => setEditingMeal(null)}
            />
          )}

          {showSettings && (
            <SettingsModal
              user={currentUser}
              onClose={() => setShowSettings(false)}
              onLogout={logout}
            />
          )}

          {showHistory && (
            <MealHistoryModal onClose={() => setShowHistory(false)} />
          )}

          {showStatistics && (
            <StatisticsModal
              meals={meals}
              onClose={() => setShowStatistics(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Dashboard;
