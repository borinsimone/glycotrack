import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import '../styles/StatisticsModal.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsModal = ({ meals, onClose }) => {
  const [chartType, setChartType] = useState('carbs');
  const [timeRange, setTimeRange] = useState('week');

  // Generate sample data for the last week
  const generateWeeklyData = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const carbData = [125.3, 142.8, 118.7, 134.2, 137.6, 156.3, 129.8];
    const insulinData = [12.5, 14.3, 11.9, 13.4, 13.9, 15.6, 13.0];

    return { days, carbData, insulinData };
  };

  const weeklyData = generateWeeklyData();

  const carbChartData = {
    labels: weeklyData.days,
    datasets: [
      {
        label: 'Carboidrati (g)',
        data: weeklyData.carbData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const insulinChartData = {
    labels: weeklyData.days,
    datasets: [
      {
        label: 'Insulina (u)',
        data: weeklyData.insulinData,
        backgroundColor: [
          '#1890ff',
          '#52c41a',
          '#faad14',
          '#f5222d',
          '#722ed1',
          '#eb2f96',
          '#13c2c2',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter',
            size: 14,
            weight: '500',
          },
          color: '#31456a',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(49, 69, 106, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        font: {
          family: 'Inter',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(163, 177, 198, 0.2)',
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#31456a',
        },
      },
      x: {
        grid: {
          color: 'rgba(163, 177, 198, 0.2)',
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#31456a',
        },
      },
    },
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
      className='statistics-modal-overlay'
      variants={overlayVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      onClick={onClose}
    >
      <motion.div
        className='statistics-modal-container'
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div className='statistics-modal-header'>
          <h2>Statistiche</h2>
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
          className='statistics-modal-content'
          variants={contentVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.div
            className='statistics-controls'
            variants={itemVariants}
          >
            <div className='chart-type-selector'>
              <motion.button
                className={`chart-type-button ${
                  chartType === 'carbs' ? 'active' : ''
                }`}
                onClick={() => setChartType('carbs')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Carboidrati
              </motion.button>
              <motion.button
                className={`chart-type-button ${
                  chartType === 'insulin' ? 'active' : ''
                }`}
                onClick={() => setChartType('insulin')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Insulina
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className='chart-container'
            variants={itemVariants}
          >
            <AnimatePresence mode='wait'>
              {chartType === 'carbs' ? (
                <motion.div
                  key='carbs-chart'
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className='chart-wrapper'
                >
                  <h3>Andamento Giornaliero Carboidrati</h3>
                  <div className='chart-inner'>
                    <Line
                      data={carbChartData}
                      options={chartOptions}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key='insulin-chart'
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className='chart-wrapper'
                >
                  <h3>Unità di Insulina Somministrate</h3>
                  <div className='chart-inner'>
                    <Bar
                      data={insulinChartData}
                      options={chartOptions}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className='statistics-summary'
            variants={itemVariants}
          >
            <div className='summary-card'>
              <div className='summary-item'>
                <span className='summary-label'>Media Carboidrati/giorno</span>
                <span className='summary-value carbs'>
                  {(
                    weeklyData.carbData.reduce((a, b) => a + b, 0) /
                    weeklyData.carbData.length
                  ).toFixed(1)}
                  g
                </span>
              </div>
              <div className='summary-item'>
                <span className='summary-label'>Media Insulina/giorno</span>
                <span className='summary-value insulin'>
                  {(
                    weeklyData.insulinData.reduce((a, b) => a + b, 0) /
                    weeklyData.insulinData.length
                  ).toFixed(1)}
                  u
                </span>
              </div>
            </div>
            <div className='summary-card'>
              <div className='summary-item'>
                <span className='summary-label'>Totale Settimana</span>
                <span className='summary-value total'>
                  {weeklyData.carbData.reduce((a, b) => a + b, 0).toFixed(1)}g
                  carboidrati
                </span>
              </div>
              <div className='summary-item'>
                <span className='summary-label'>Rapporto Medio</span>
                <span className='summary-value ratio'>
                  1u :{' '}
                  {Math.round(
                    weeklyData.carbData.reduce((a, b) => a + b, 0) /
                      weeklyData.insulinData.reduce((a, b) => a + b, 0)
                  )}
                  g
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StatisticsModal;
