import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/SettingsModal.css';

const SettingsModal = ({ user, onClose, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [lastUpdate, setLastUpdate] = useState('');
  const { insulinSettings, setInsulinSettings, predefinedRatios } =
    useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setLastUpdate(formatter.format(now));
  }, []);

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

  const handleInsulinRatioChange = (newRatio) => {
    setInsulinSettings({
      ...insulinSettings,
      predefinedRatio: newRatio,
      useCustomRatio: false,
    });
  };

  const handleCustomRatioToggle = (useCustom) => {
    setInsulinSettings({
      ...insulinSettings,
      useCustomRatio: useCustom,
    });
  };

  const handleCustomRatioChange = (newRatio) => {
    setInsulinSettings({
      ...insulinSettings,
      customRatio: parseFloat(newRatio) || 10,
    });
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
                  Rapporto Insulina/Carboidrati:
                </span>
                <select
                  className='ratio-select'
                  value={insulinSettings.predefinedRatio}
                  onChange={(e) => handleInsulinRatioChange(e.target.value)}
                  disabled={insulinSettings.useCustomRatio}
                >
                  <option value='1:5'>1:5 (1 unità per 5g carboidrati)</option>
                  <option value='1:10'>
                    1:10 (1 unità per 10g carboidrati)
                  </option>
                  <option value='1:15'>
                    1:15 (1 unità per 15g carboidrati)
                  </option>
                  <option value='1:20'>
                    1:20 (1 unità per 20g carboidrati)
                  </option>
                </select>
              </div>

              <div className='setting-row'>
                <span className='setting-label'>Rapporto personalizzato:</span>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <input
                    type='checkbox'
                    checked={insulinSettings.useCustomRatio}
                    onChange={(e) => handleCustomRatioToggle(e.target.checked)}
                  />
                  Usa rapporto personalizzato
                </label>
              </div>

              {insulinSettings.useCustomRatio && (
                <div className='setting-row'>
                  <span className='setting-label'>
                    Grammi carboidrati per 1u insulina:
                  </span>
                  <input
                    type='number'
                    className='edit-input'
                    value={insulinSettings.customRatio}
                    onChange={(e) => handleCustomRatioChange(e.target.value)}
                    min='1'
                    max='50'
                    step='0.5'
                    style={{ width: '100px' }}
                  />
                </div>
              )}

              <div className='setting-info'>
                <small>
                  Rapporto attuale: 1 unità di insulina per{' '}
                  {insulinSettings.useCustomRatio
                    ? insulinSettings.customRatio
                    : predefinedRatios[insulinSettings.predefinedRatio]}
                  g di carboidrati. Questo viene utilizzato per calcolare
                  automaticamente le dosi di insulina nei pasti.
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
                <span className='info-value'>{lastUpdate}</span>
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
