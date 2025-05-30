import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [insulinSettings, setInsulinSettings] = useState({
    useCustomRatio: false,
    predefinedRatio: '1:10', // 1 unit per 10g carbs
    customRatio: 10, // grams of carbs per 1 unit of insulin
  });

  // Predefined insulin-to-carb ratios
  const predefinedRatios = {
    '1:5': 5, // 1 unit per 5g carbs (aggressive)
    '1:10': 10, // 1 unit per 10g carbs (moderate)
    '1:15': 15, // 1 unit per 15g carbs (conservative)
    '1:20': 20, // 1 unit per 20g carbs (very conservative)
  };

  // Function to calculate insulin units
  const calculateInsulinUnits = (carbGrams) => {
    const ratio = insulinSettings.useCustomRatio
      ? insulinSettings.customRatio
      : predefinedRatios[insulinSettings.predefinedRatio];

    const units = carbGrams / ratio;
    return Math.round(units * 10) / 10; // Round to 1 decimal place
  };

  const value = {
    insulinSettings,
    setInsulinSettings,
    predefinedRatios,
    calculateInsulinUnits,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
