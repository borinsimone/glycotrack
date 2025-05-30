import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/AddMealForm.css';

const AddMealForm = ({ onAddMeal, onClose }) => {
  const [mealName, setMealName] = useState('');
  const [currentFood, setCurrentFood] = useState({
    name: '',
    grams: '',
  });
  const [foodItems, setFoodItems] = useState([]);
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(false);
  const [error, setError] = useState('');

  // Use global settings context
  const { calculateInsulinUnits, insulinSettings } = useSettings();

  // Function to translate food name to English
  const translateToEnglish = async (italianText) => {
    try {
      console.log('🌐 [DEBUG] Traduzione richiesta per:', italianText);

      // Using MyMemory Translation API (free, no key required)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          italianText
        )}&langpair=it|en`
      );

      if (!response.ok) {
        throw new Error('Errore nella traduzione');
      }

      const data = await response.json();
      const translatedText = data.responseData?.translatedText || italianText;

      console.log('🌐 [DEBUG] Traduzione completata:', {
        original: italianText,
        translated: translatedText,
      });

      return translatedText;
    } catch (error) {
      console.error('❌ [DEBUG] Errore traduzione:', error);
      // Fallback: return original text if translation fails
      return italianText;
    }
  };

  // Function to get nutrition data from API
  const getNutritionData = async (foodName, grams) => {
    try {
      setIsLoadingNutrition(true);
      setError('');

      // Translate food name to English first
      const englishFoodName = await translateToEnglish(foodName);

      console.log('🔍 [DEBUG] Richiesta API Nutritionix:', {
        originalName: foodName,
        translatedName: englishFoodName,
        query: `${grams}g ${englishFoodName}`,
        grams,
      });

      // Using Nutritionix API with translated name
      const response = await fetch(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': '13672595',
            'x-app-key': '205ca681b8105210da1e4779cd1ce67b',
          },
          body: JSON.stringify({
            query: `${grams}g ${englishFoodName}`,
          }),
        }
      );

      console.log(
        '📡 [DEBUG] Response status:',
        response.status,
        response.statusText
      );

      if (!response.ok) {
        console.error('❌ [DEBUG] Response non OK:', response.status);
        throw new Error('Errore nel recupero dei dati nutrizionali');
      }

      const data = await response.json();
      console.log(
        '📊 [DEBUG] Dati completi API:',
        JSON.stringify(data, null, 2)
      );

      // Extract total carbohydrate content from Nutritionix response
      const carbContent = data.foods?.[0]?.nf_total_carbohydrate || 0;

      console.log('🍞 [DEBUG] Carboidrati estratti:', {
        carbContent,
        foods: data.foods?.length || 0,
        firstFood: data.foods?.[0]?.food_name || 'N/A',
      });

      return Math.round(carbContent * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('💥 [DEBUG] Errore API nutrizione:', error);
      console.error('💥 [DEBUG] Error details:', {
        message: error.message,
        stack: error.stack,
      });
      // Fallback: estimate carb content (more realistic than sugar estimate)
      const fallbackCarbs = Math.round(parseFloat(grams) * 0.25 * 100) / 100;
      console.log('🔄 [DEBUG] Usando fallback carb content:', fallbackCarbs);
      return fallbackCarbs;
    } finally {
      setIsLoadingNutrition(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    if (!currentFood.name || !currentFood.grams) {
      setError('Inserisci nome cibo e grammi');
      return;
    }

    const grams = parseFloat(currentFood.grams);
    if (isNaN(grams) || grams <= 0) {
      setError('Inserisci un valore valido per i grammi');
      return;
    }

    // Get carb content from API
    const carbContent = await getNutritionData(currentFood.name, grams);
    const insulinUnits = calculateInsulinUnits(carbContent);

    const newFoodItem = {
      id: Date.now(),
      name: currentFood.name,
      grams: grams,
      carbContent: carbContent,
      insulinUnits: insulinUnits,
    };

    setFoodItems([...foodItems, newFoodItem]);
    setCurrentFood({ name: '', grams: '' });
    setError('');
  };

  const removeFoodItem = (id) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const getTotalCarbs = () => {
    return foodItems
      .reduce((total, item) => total + item.carbContent, 0)
      .toFixed(1);
  };

  const getTotalInsulin = () => {
    return foodItems
      .reduce((total, item) => total + item.insulinUnits, 0)
      .toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mealName) {
      setError('Inserisci il nome del pasto');
      return;
    }

    if (foodItems.length === 0) {
      setError('Aggiungi almeno un cibo al pasto');
      return;
    }

    const mealData = {
      name: mealName,
      foodItems: foodItems,
      carbLevel: `${getTotalCarbs()}g`,
      insulinUnits: `${getTotalInsulin()}u`,
      insulinSettings: insulinSettings,
    };

    onAddMeal(mealData);
  };

  return (
    <div className='form-overlay'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='mealName'>Nome Pasto</label>
            <input
              type='text'
              id='mealName'
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder='es. Colazione, Pranzo, Cena'
              required
            />
          </div>

          <div className='food-section'>
            <h3>Aggiungi Cibo</h3>
            <div className='food-input-row'>
              <div className='form-group'>
                <label htmlFor='foodName'>Nome Cibo</label>
                <input
                  type='text'
                  id='foodName'
                  value={currentFood.name}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, name: e.target.value })
                  }
                  placeholder='es. Pasta, Riso, Pane'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='grams'>Grammi</label>
                <input
                  type='number'
                  id='grams'
                  value={currentFood.grams}
                  onChange={(e) =>
                    setCurrentFood({ ...currentFood, grams: e.target.value })
                  }
                  placeholder='100'
                  min='1'
                />
              </div>
            </div>

            <button
              type='button'
              className='add-food-button'
              onClick={handleAddFood}
              disabled={isLoadingNutrition}
            >
              {isLoadingNutrition ? 'Caricamento...' : 'Aggiungi Cibo'}
            </button>
          </div>

          {foodItems.length > 0 && (
            <div className='food-list-section'>
              <h3>Cibi nel Pasto</h3>
              <div className='food-list'>
                {foodItems.map((item) => (
                  <div
                    key={item.id}
                    className='food-item'
                  >
                    <div className='food-details'>
                      <span className='food-name'>
                        {item.name}
                        {item.grams > 1 ? ` (${item.grams}g)` : ''}
                      </span>
                      <span className='food-info'>
                        {item.carbContent}g carboidrati • {item.insulinUnits}u
                        insulina
                      </span>
                    </div>
                    <button
                      type='button'
                      className='remove-food-button'
                      onClick={() => removeFoodItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className='total-summary'>
                <div className='total-carbs'>
                  <strong>Carboidrati totali: {getTotalCarbs()}g</strong>
                </div>
                <div className='total-insulin'>
                  <strong>Insulina totale: {getTotalInsulin()}u</strong>
                </div>
              </div>
            </div>
          )}

          {error && <div className='error-message'>{error}</div>}

          <div className='form-buttons'>
            <button
              type='button'
              className='cancel-button'
              onClick={onClose}
            >
              Annulla
            </button>
            <button
              type='submit'
              className='submit-button'
            >
              Salva Pasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMealForm;
