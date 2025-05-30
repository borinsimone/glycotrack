import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Get the base name from Vite's base config
  const basename = import.meta.env.MODE === 'production' ? '/glycotrack' : '';

  return (
    <div className='App'>
      <Router basename={basename}>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              <Route
                path='/login'
                element={<Login />}
              />
              <Route
                path='/register'
                element={<Register />}
              />
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/'
                element={<Navigate to='/dashboard' />}
              />
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
