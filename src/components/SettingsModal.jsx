import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SettingsModal.css';

const SettingsModal = ({ user, onClose, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [insulinRatio, setInsulinRatio] = useState('1:10'); // Default ratio
  const navigate = useNavigate();

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <div
      className='settings-overlay'
      onClick={onClose}
    >
      <div
        className='settings-container'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='settings-header'>
          <h2>Impostazioni</h2>
          <button
            className='close-button'
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className='settings-content'>
          {/* Account Information Section */}
          <div className='settings-section'>
            <h3>Informazioni Account</h3>
            <div className='account-info'>
              <div className='info-row'>
                <span className='info-label'>Email:</span>
                <span className='info-value'>
                  {user?.email || 'Non disponibile'}
                </span>
              </div>

              <div className='info-row'>
                <span className='info-label'>Nome:</span>
                {isEditing ? (
                  <input
                    type='text'
                    className='edit-input'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder='Inserisci il tuo nome'
                  />
                ) : (
                  <span className='info-value'>
                    {user?.displayName || 'Non impostato'}
                  </span>
                )}
              </div>

              <div className='profile-actions'>
                {isEditing ? (
                  <div className='edit-actions'>
                    <button
                      className='save-button'
                      onClick={handleSaveProfile}
                    >
                      Salva
                    </button>
                    <button
                      className='cancel-edit-button'
                      onClick={() => setIsEditing(false)}
                    >
                      Annulla
                    </button>
                  </div>
                ) : (
                  <button
                    className='edit-profile-button'
                    onClick={() => setIsEditing(true)}
                  >
                    Modifica Profilo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Insulin Settings Section */}
          <div className='settings-section'>
            <h3>Impostazioni Insulina</h3>
            <div className='insulin-settings'>
              <div className='setting-row'>
                <span className='setting-label'>
                  Rapporto Insulina/Zuccheri:
                </span>
                <select
                  className='ratio-select'
                  value={insulinRatio}
                  onChange={(e) => setInsulinRatio(e.target.value)}
                >
                  <option value='1:8'>1:8 (1 unità per 8g di zuccheri)</option>
                  <option value='1:10'>
                    1:10 (1 unità per 10g di zuccheri)
                  </option>
                  <option value='1:12'>
                    1:12 (1 unità per 12g di zuccheri)
                  </option>
                  <option value='1:15'>
                    1:15 (1 unità per 15g di zuccheri)
                  </option>
                  <option value='custom'>Personalizzato</option>
                </select>
              </div>

              <div className='setting-info'>
                <small>
                  Questo rapporto verrà utilizzato per calcolare automaticamente
                  le dosi di insulina consigliate (funzionalità in arrivo).
                </small>
              </div>
            </div>
          </div>

          {/* App Information Section */}
          <div className='settings-section'>
            <h3>App</h3>
            <div className='app-info'>
              <div className='info-row'>
                <span className='info-label'>Versione:</span>
                <span className='info-value'>1.0.0</span>
              </div>
              <div className='info-row'>
                <span className='info-label'>Ultimo aggiornamento:</span>
                <span className='info-value'>Gennaio 2024</span>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className='settings-section logout-section'>
            <button
              className='logout-button'
              onClick={handleLogout}
            >
              Disconnetti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
