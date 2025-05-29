import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../LoadingScreen';
import styles from '../../styles/auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Credenziali non valide');
    }

    setLoading(false);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {loading && <LoadingScreen message='Accesso in corso...' />}

      <motion.div
        className={styles.container}
        initial='initial'
        animate='in'
        exit='out'
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.card}
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.h2
            className={styles.title}
            variants={itemVariants}
          >
            Accedi a GlycoTrack
          </motion.h2>

          {/* Demo credentials info */}
          <div
            style={{
              background: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              color: '#0050b3',
            }}
          >
            <strong>Credenziali Demo:</strong>
            <br />
            Email: demo@glycotrack.com
            <br />
            Password: demo123
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <motion.div
              className={styles.inputGroup}
              variants={itemVariants}
            >
              <label className={styles.label}>Email</label>
              <motion.input
                type='email'
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                required
              />
            </motion.div>

            <motion.div
              className={styles.inputGroup}
              variants={itemVariants}
            >
              <label className={styles.label}>Password</label>
              <motion.input
                type='password'
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                required
              />
            </motion.div>

            {error && (
              <motion.div
                className={styles.error}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              disabled={loading}
              type='submit'
              className={styles.button}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Accesso...' : 'Accedi'}
            </motion.button>
          </form>

          <motion.div
            className={styles.switchText}
            variants={itemVariants}
          >
            Non hai un account?{' '}
            <Link
              to='/register'
              className={styles.switchLink}
            >
              Registrati
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Login;
