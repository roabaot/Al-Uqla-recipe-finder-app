import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = '9f5c6212eba44c8584768a8780945458'; // Replace with your actual API key

const RecipeCard = ({ recipe }) => {
  const { title, image } = recipe;

  return (
    <div className="bg-white p-4 rounded shadow">
      <img src={image} alt={title} className="mb-4 object-none w-full h-full" />
      <h2 className="text-xl font-bold mb-2">{title}</h2>
    </div>
  );
};

const RecipeDetails = ({ recipe }) => {
  const { title, image, extendedIngredients, analyzedInstructions } = recipe;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <img src={image} alt={title} className="mb-4" />
      <h3 className="font-bold mb-2">Ingredients:</h3>
      <ul className="list-disc ml-6 mb-4">
        {extendedIngredients.map((ingredient, index) => (
          <li key={index}>{ingredient.original}</li>
        ))}
      </ul>
      <h3 className="font-bold mb-2">Instructions:</h3>
      <ol className="list-decimal ml-6">
        {analyzedInstructions.map((step, index) => (
          <li key={index}>{step.step}</li>
        ))}
      </ol>
    </div>
  );
};

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`
      );
      setRecipes(response.data.results);
    } catch (error) {
      setError('Unable to fetch recipes. Please try again.');
    }
  };

  const handleRecipeClick = async (recipeId) => {
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      console.log('====================================');
      console.log(response);
      console.log('====================================');
      setSelectedRecipe(response.data);
    } catch (error) {
      setError('Unable to fetch recipe details. Please try again.');
    }
  };

  const handleBackButtonClick = () => {
    setSelectedRecipe(null);
  };

  if (selectedRecipe) {
    return (
      <div className="container mx-auto p-4">
        <button
          onClick={handleBackButtonClick}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-4 rounded"
        >
          Back
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <RecipeDetails recipe={selectedRecipe} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Recipe Finder App</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter ingredients or keywords"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 ml-2 rounded"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleRecipeClick(recipe.id)}
            className="cursor-pointer"
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;