import React, { useState } from 'react';
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

  // Function to get nutrition data from API
  const getNutritionData = async (foodName, grams) => {
    try {
      setIsLoadingNutrition(true);
      setError('');

      // Using a nutrition API (example with Edamam or similar)
      // Replace with your preferred nutrition API
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY&nutrition-type=cooking&ingr=${grams}g ${foodName}`
      );

      if (!response.ok) {
        throw new Error('Errore nel recupero dei dati nutrizionali');
      }

      const data = await response.json();

      // Extract sugar content from response
      const sugarContent = data.totalNutrients?.SUGAR?.quantity || 0;

      return Math.round(sugarContent * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('Errore API nutrizione:', error);
      // Fallback: estimate sugar content (this is just an example)
      return Math.round(parseFloat(grams) * 0.1 * 100) / 100; // Rough estimate
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

    // Get sugar content from API
    const sugarContent = await getNutritionData(currentFood.name, grams);

    const newFoodItem = {
      id: Date.now(),
      name: currentFood.name,
      grams: grams,
      sugarContent: sugarContent,
    };

    setFoodItems([...foodItems, newFoodItem]);
    setCurrentFood({ name: '', grams: '' });
    setError('');
  };

  const removeFoodItem = (id) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const getTotalSugar = () => {
    return foodItems
      .reduce((total, item) => total + item.sugarContent, 0)
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
      sugarLevel: `${getTotalSugar()}g`,
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
                        {item.sugarContent}g zuccheri
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
              <div className='total-sugar'>
                <strong>Zuccheri totali: {getTotalSugar()}g</strong>
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
