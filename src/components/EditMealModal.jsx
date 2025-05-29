import React, { useState } from 'react';
import '../styles/EditMealModal.css';

const EditMealModal = ({ meal, onUpdate, onClose }) => {
  const [mealName, setMealName] = useState(meal.name);
  const [foodItems, setFoodItems] = useState([...meal.foodItems]);
  const [currentFood, setCurrentFood] = useState({ name: '', grams: '' });
  const [error, setError] = useState('');

  const handleAddFood = (e) => {
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

    // Simple sugar estimation for demo
    const sugarContent = Math.round(grams * 0.1 * 100) / 100;

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
      setError('Il pasto deve contenere almeno un cibo');
      return;
    }

    const updatedMeal = {
      ...meal,
      name: mealName,
      foodItems: foodItems,
      sugarLevel: `${getTotalSugar()}g`,
    };

    onUpdate(updatedMeal);
  };

  return (
    <div className='form-overlay'>
      <div className='form-container'>
        <h2>Modifica Pasto</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='mealName'>Nome Pasto</label>
            <input
              type='text'
              id='mealName'
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
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
            >
              Aggiungi Cibo
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
                        {item.name} ({item.grams}g)
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
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMealModal;
