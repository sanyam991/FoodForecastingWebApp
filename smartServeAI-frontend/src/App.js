import React, { useState, useEffect } from 'react';

// Main App component responsible for managing overall application state.
function App() {
  // State for user authentication and roles.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // 'guest', 'chef', 'manager', 'admin'
  const [currentUsername, setCurrentUsername] = useState('');

  // State to manage the current active page for navigation.
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'forecasting', 'historical', 'inventory', 'reports', 'feedback', 'settings', 'about', 'login'

  // State to hold historical food preparation data. This is currently mocked
  // but would ideally come from a database in a real application.
  const [historicalData, setHistoricalData] = useState([]);

  // State to store the result of the food demand forecast from the backend.
  const [forecastResult, setForecastResult] = useState(null);
  // Loading state for the forecast API call.
  const [loadingForecast, setLoadingForecast] = useState(false);
  // Error state for the forecast API call.
  const [errorForecast, setErrorForecast] = useState(null);

  // State to hold the details of the current event being forecasted.
  const [currentEventDetails, setCurrentEventDetails] = useState(null);

  // State for displaying general messages (e.g., "Copied to clipboard").
  const [message, setMessage] = useState(null);

  // Mock inventory data - can be used for Fridge Tetris
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Chicken Breast', quantity: 50, unit: 'kg', minStock: 10 },
    { id: 2, name: 'Rice', quantity: 100, unit: 'kg', minStock: 20 },
    { id: 3, name: 'Tomatoes', quantity: 30, unit: 'kg', minStock: 5 },
    { id: 4, name: 'Onions', quantity: 40, unit: 'kg', minStock: 8 },
    { id: 5, name: 'Pasta', quantity: 70, unit: 'kg', minStock: 15 },
    { id: 6, name: 'Ground Beef', quantity: 40, unit: 'kg', minStock: 8 },
    { id: 7, name: 'Potatoes', quantity: 60, unit: 'kg', minStock: 12 },
    { id: 8, name: 'Spinach', quantity: 20, unit: 'kg', minStock: 4 },
    { id: 9, name: 'Cheese', quantity: 25, unit: 'kg', minStock: 5 },
    { id: 10, name: 'Bell Peppers', quantity: 35, unit: 'kg', minStock: 7 },
  ]);

  // AI Feature States (for Forecasting Page)
  const [recipeSuggestions, setRecipeSuggestions] = useState(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [errorRecipes, setErrorRecipes] = useState(null);

  const [ingredientToSubstitute, setIngredientToSubstitute] = useState('');
  const [substitutionSuggestions, setSubstitutionSuggestions] = useState(null);
  const [loadingSubstitutions, setLoadingSubstitutions] = useState(false);
  const [errorSubstitutions, setErrorSubstitutions] = useState(null);

  const [leftoverSuggestions, setLeftoverSuggestions] = useState(null);
  const [loadingLeftovers, setLoadingLeftovers] = useState(false);
  const [errorLeftovers, setErrorLeftovers] = useState(null);


  // useEffect hook to initialize mock historical data when the component mounts.
  useEffect(() => {
    setHistoricalData([
      { date: '2024-01-01', eventType: 'Holiday Party', audienceProfile: 'Mixed', footfall: 150, foodPrepared: 200, foodConsumed: 180 },
      { date: '2024-01-15', eventType: 'Corporate Lunch', audienceProfile: 'Professionals', footfall: 80, foodPrepared: 100, foodConsumed: 90 },
      { date: '2024-02-01', eventType: 'Weekend Brunch', audienceProfile: 'Families', footfall: 120, foodPrepared: 150, foodConsumed: 140 },
      { date: '2024-02-10', eventType: 'Birthday Celebration', audienceProfile: 'Young Adults', footfall: 60, foodPrepared: 70, foodConsumed: 65 },
    ]);
  }, []); // Empty dependency array means this effect runs only once after the initial render.

  /**
   * Handles mock login. In a real app, this would involve API calls to a backend.
   * @param {string} username - The username entered.
   * @param {string} password - The password entered.
   * @param {string} role - The selected role.
   */
  const handleLogin = (username, password, role) => {
    // Mock authentication logic
    if (username && password) {
      setIsLoggedIn(true);
      setUserRole(role);
      setCurrentUsername(username);
      setCurrentPage('home'); // Redirect to home after login
      showMessage(`Welcome, ${username} (${role})!`);
    } else {
      showMessage('Please enter username and password.', 4000);
    }
  };

  /**
   * Handles mock logout.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('guest');
    setCurrentUsername('');
    setCurrentPage('login'); // Redirect to login after logout
    showMessage('Logged out successfully.');
  };

  /**
   * Displays a temporary message to the user.
   * @param {string} text - The message text.
   * @param {number} duration - How long the message should be displayed in milliseconds.
   */
  const showMessage = (text, duration = 3000) => {
    setMessage(text);
    const timer = setTimeout(() => {
      setMessage(null);
    }, duration);
    return () => clearTimeout(timer); // Cleanup function
  };

  /**
   * Copies text to the clipboard.
   * Uses document.execCommand('copy') as navigator.clipboard.writeText() might not work in some iframe contexts.
   * @param {string} text - The text to copy.
   */
  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showMessage('Copied to clipboard!');
      } else {
        showMessage('Failed to copy.');
      }
    } catch (err) {
      console.error('Copy command failed:', err);
      showMessage('Failed to copy.');
    }
    document.body.removeChild(el);
  };

  /**
   * Function to call the Spring Boot backend for food preparation forecasting.
   * It sends event details and historical data to the backend for prediction.
   * @param {object} eventDetails - Details of the event to be forecasted (eventType, audienceProfile, footfall, date).
   */
  const fetchForecast = async (eventDetails) => {
    setLoadingForecast(true); // Set loading state to true
    setErrorForecast(null); // Clear any previous forecast errors
    setForecastResult(null); // Clear previous forecast results
    setCurrentEventDetails(eventDetails); // Store current event details for other AI features

    // Clear previous AI outputs when a new forecast is initiated
    setRecipeSuggestions(null);
    setSubstitutionSuggestions(null);
    setLeftoverSuggestions(null);


    try {
      // IMPORTANT: If your React app is running on a different port than your Spring Boot backend
      // (e.g., React on 3000, Spring Boot on 8080), you MUST configure a proxy in your React app's package.json.
      // Example in package.json: "proxy": "http://localhost:8080"
      // With the proxy, you can use the relative path '/api/forecast'.
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        // Send eventDetails and historicalData in the request body as JSON string.
        body: JSON.stringify({
          eventDetails: eventDetails,
          historicalData: historicalData
        }),
      });

      // Check if the HTTP response was successful (status code 2xx).
      if (!response.ok) {
        const errorText = await response.text(); // Get detailed error message from backend response.
        throw new Error(`Backend error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Parse the JSON response from the backend.
      const data = await response.json();
      setForecastResult(data); // Update forecast result state.

    } catch (err) {
      console.error("Error fetching forecast from backend:", err);
      // Display a user-friendly error message, guiding them to check the backend.
      setErrorForecast(`Failed to get forecast. Please ensure your Spring Boot backend is running and accessible at http://localhost:8080/api/forecast. Error: ${err.message}`);
    } finally {
      setLoadingForecast(false); // Reset loading state.
    }
  };

  /**
   * Function to generate recipe suggestions using the Google Gemini API.
   * It constructs a prompt based on event details and forecasted food quantity.
   */
  const generateRecipeSuggestions = async () => {
    // Ensure forecast data and event details are available before generating recipes.
    if (!forecastResult || !currentEventDetails) {
      setErrorRecipes("Please get a forecast first.");
      return;
    }

    setLoadingRecipes(true); // Set loading state for recipes.
    setErrorRecipes(null); // Clear previous recipe errors.
    setRecipeSuggestions(null); // Clear previous recipe suggestions.

    // Construct the prompt for the AI.
    const prompt = `Given an event type of '${currentEventDetails.eventType}', an audience profile of '${currentEventDetails.audienceProfile}', an expected footfall of '${currentEventDetails.footfall}', and a forecasted food quantity of '${forecastResult.predictedFoodQuantity}' units, suggest 3-5 distinct recipe ideas or meal components that would be suitable. For each suggestion, provide a brief description and mention key ingredients. Focus on minimizing waste and catering to the specified audience. Format the output as a simple numbered list.`;

    // Prepare chat history for the AI API request.
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    // IMPORTANT: API key should be an empty string. Canvas will automatically provide it at runtime.
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      // Make a POST request to the AI API.
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json(); // Parse the JSON response from AI.

      // Check if the response contains valid content.
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setRecipeSuggestions(text); // Update recipe suggestions state.
      } else {
        setErrorRecipes("Failed to generate recipes. Please try again.");
        console.error("AI API response structure unexpected:", result);
      }
    } catch (err) {
      console.error("Error calling AI API:", err);
      setErrorRecipes("An error occurred while generating recipes.");
    } finally {
      setLoadingRecipes(false); // Reset loading state.
    }
  };

  /**
   * Function to generate ingredient substitution suggestions using the Google Gemini API.
   * It takes an inngredient from user input and provides alternatives based on event context.
   */
  const generateSubstitutionSuggestions = async () => {
    // Validate input and ensure event context is available.
    if (!ingredientToSubstitute.trim()) {
      setErrorSubstitutions("Please enter an ingredient to substitute.");
      return;
    }
    if (!currentEventDetails) {
      setErrorSubstitutions("Please get a forecast first to provide context for substitution.");
      return;
    }

    setLoadingSubstitutions(true); // Set loading state for substitutions.
    setErrorSubstitutions(null); // Clear previous substitution errors.
    setSubstitutionSuggestions(null); // Clear previous previous substitution suggestions.

    // Construct the prompt for ingredient substitutions.
    const prompt = `Given an event type of '${currentEventDetails.eventType}' and an audience profile of '${currentEventDetails.audienceProfile}', suggest 3-5 suitable ingredient substitutions for '${ingredientToSubstitute}'. Consider common dietary restrictions (e.g., dairy-free, gluten-free, nut-free) and general culinary alternatives. For each substitution, briefly explain why it's a good alternative. Format the output as a simple numbered list.`;

    // Prepare chat history for the AI API request.
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    // IMPORTANT: API key should be an empty string. Canvas will automatically provide it at runtime.
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      // Make a POST request to the AI API.
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json(); // Parse the JSON response from AI.

      // Check if the response contains valid content.
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setSubstitutionSuggestions(text); // Update substitution suggestions state.
      } else {
        setErrorSubstitutions("Failed to get substitutions. Please try again.");
        console.error("AI API response structure unexpected:", result);
      }
    } catch (err) {
      console.error("Error calling AI API for substitutions:", err);
      setErrorSubstitutions("An error occurred while generating substitutions.");
    } finally {
      setLoadingSubstitutions(false); // Reset loading state.
    }
  };

  /**
   * Function to generate leftover utilization suggestions using the Google Gemini API.
   * It provides creative ways to use potential leftovers based on event context and forecast.
   */
  const generateLeftoverSuggestions = async () => {
    // Ensure forecast data and event details are available before generating ideas.
    if (!forecastResult || !currentEventDetails) {
      setErrorLeftovers("Please get a forecast first.");
      return;
    }

    setLoadingLeftovers(true); // Set loading state for leftovers.
    setErrorLeftovers(null); // Clear previous leftover errors.
    setLeftoverSuggestions(null); // Clear previous leftover suggestions.

    // Construct the prompt for leftover utilization ideas.
    const prompt = `Given an event type of '${currentEventDetails.eventType}', an audience profile of '${currentEventDetails.audienceProfile}', and a forecasted food quantity of '${forecastResult.predictedFoodQuantity}' units (implying potential leftovers if not fully consumed), suggest 3-5 creative and practical ways to utilize potential leftovers from this event. Focus on minimizing food waste. For each idea, briefly describe how it can be implemented. Format the output as a simple numbered list.`;

    // Prepare chat history for the AI API request.
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    // IMPORTANT: API key should be an empty string. Canvas will automatically provide it at runtime.
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      // Make a POST request to the AI API.
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json(); // Parse the JSON response from AI.

      // Check if the response contains valid content.
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setLeftoverSuggestions(text); // Update leftover suggestions state.
      } else {
        setErrorLeftovers("Failed to generate leftover suggestions. Please try again.");
        console.error("AI API response structure unexpected:", result);
      }
    } catch (err) {
      console.error("Error calling AI API for leftovers:", err);
      setErrorLeftovers("An error occurred while generating leftover suggestions.");
    } finally {
      setLoadingLeftovers(false); // Reset loading state.
    }
  };


  return (
    // Apply Inter font globally to the main container
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-10 font-inter">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-lg py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-gray-800">AI-Powered Kitchen</span>
            {isLoggedIn && (
              <span className="ml-4 text-sm sm:text-base text-gray-500">
                Logged in as: {currentUsername} ({userRole})
              </span>
            )}
          </div>
          <div className="flex space-x-4 sm:space-x-6">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
            >
              Home
            </button>
            {isLoggedIn && (userRole === 'chef' || userRole === 'manager' || userRole === 'admin') && (
              <button
                onClick={() => setCurrentPage('forecasting')}
                className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'forecasting' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
              >
                Forecasting & AI
              </button>
            )}
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setCurrentPage('historical')}
                  className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'historical' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                >
                  Historical Data
                </button>
                {(userRole === 'manager' || userRole === 'admin') && (
                  <button
                    onClick={() => setCurrentPage('inventory')}
                    className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                  >
                    Inventory
                  </button>
                )}
                {(userRole === 'manager' || userRole === 'admin') && (
                  <button
                    onClick={() => setCurrentPage('reports')}
                    className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                  >
                    Reports
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage('feedback')}
                  className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'feedback' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                >
                  Feedback
                </button>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                >
                  Settings
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage('about')}
              className={`text-gray-600 hover:text-blue-600 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
            >
              About Us
            </button>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className={`text-green-600 hover:text-green-800 font-medium text-sm sm:text-base transition duration-150 ease-in-out transform hover:scale-105 ${currentPage === 'login' ? 'text-green-600 border-b-2 border-green-600' : ''}`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl mt-8">
        {/* Global Message Display */}
        {message && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {message}
          </div>
        )}

        {/* Conditional Rendering based on currentPage */}
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'forecasting' && isLoggedIn && (userRole === 'chef' || userRole === 'manager' || userRole === 'admin') && (
          <ForecastingPage
            fetchForecast={fetchForecast}
            loadingForecast={loadingForecast}
            errorForecast={errorForecast}
            forecastResult={forecastResult}
            currentEventDetails={currentEventDetails}
            copyToClipboard={copyToClipboard}
            generateRecipeSuggestions={generateRecipeSuggestions}
            loadingRecipes={loadingRecipes}
            errorRecipes={errorRecipes}
            recipeSuggestions={recipeSuggestions}
            ingredientToSubstitute={ingredientToSubstitute}
            setIngredientToSubstitute={setIngredientToSubstitute}
            generateSubstitutionSuggestions={generateSubstitutionSuggestions}
            loadingSubstitutions={loadingSubstitutions}
            errorSubstitutions={setErrorSubstitutions}
            substitutionSuggestions={substitutionSuggestions}
            generateLeftoverSuggestions={generateLeftoverSuggestions}
            loadingLeftovers={loadingLeftovers}
            errorLeftovers={errorLeftovers}
          />
        )}

        {currentPage === 'historical' && (
          <HistoricalDataPage historicalData={historicalData} />
        )}

        {currentPage === 'inventory' && isLoggedIn && (userRole === 'manager' || userRole === 'admin') && (
          <InventoryPage inventory={inventory} setInventory={setInventory} showMessage={showMessage} />
        )}

        {currentPage === 'reports' && isLoggedIn && (userRole === 'manager' || userRole === 'admin') && (
          <ReportsPage />
        )}

        {currentPage === 'feedback' && isLoggedIn && (
          <FeedbackPage />
        )}

        {currentPage === 'settings' && isLoggedIn && (
          <SettingsPage currentUsername={currentUsername} userRole={userRole} />
        )}

        {currentPage === 'about' && (
          <AboutUsPage />
        )}

        {currentPage === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}

      </div>
    </div>
  );
}

// New HomePage component - simplified to only contain general info and games
function HomePage({ setCurrentPage }) {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-16 sm:py-24 rounded-xl shadow-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10 animate-pulse-slow"></div> {/* Animated background */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Cook Smarter, Waste Less.
          </h1>
          <p className="text-lg sm:text-xl mb-8 animate-fade-in-up delay-200 font-medium">
            Your Smart Partner for Sustainable Kitchens.
          </p>
          <a
            href="#feature-access-section" // Smooth scroll to new feature access section
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up delay-400"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Problem & Solution Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 bg-red-50 rounded-xl shadow-lg border border-red-200 animate-fade-in-left">
          <h2 className="text-2xl font-bold text-red-700 mb-3">The Problem: Food Waste 🗑️</h2>
          <p className="text-gray-700 text-base leading-relaxed">Millions of tons of food are wasted annually due to inaccurate predictions. This impacts budgets and the environment.</p>
        </div>
        <div className="p-6 bg-green-50 rounded-xl shadow-lg border border-green-200 animate-fade-in-right">
          <h2 className="text-2xl font-bold text-green-700 mb-3">Our Solution: Smart Forecasting 💡</h2>
          <p className="text-gray-700 text-base leading-relaxed">AI-Powered Kitchen helps you forecast precisely, manage inventory, and optimize preparation, reducing waste significantly.</p>
        </div>
      </div>

      {/* Inspiring Quotes */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-inner mb-12 w-full text-center animate-fade-in-up delay-600">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Words to Live By:</h3>
        <p className="text-lg italic text-gray-800 mb-2 leading-relaxed">"The greatest threat to our planet is the belief that someone else will save it."</p>
        <p className="text-md text-gray-600 font-medium">- Robert Swan</p>
        <p className="text-lg italic text-gray-800 mt-4 mb-2 leading-relaxed">"Waste not, want not."</p>
        <p className="text-md text-gray-600 font-medium">- Proverb</p>
      </div>

      {/* Fridge Tetris Game Section */}
      <div className="w-full mt-8 p-4 sm:p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-200 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
          Play Fridge Tetris (Inventory Organizer)! 🧊
        </h2>
        <p className="text-base text-gray-700 mb-6 leading-relaxed">
          Test your space optimization skills by arranging food items in a virtual fridge.
        </p>
        <FridgeTetrisGame />
      </div>


      {/* New Section: Access AI and Forecasting Features */}
      <div id="feature-access-section" className="w-full mt-8 p-4 sm:p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-200 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">Unlock Smart Kitchen Features!</h2>
        <p className="text-base text-gray-700 mb-6 leading-relaxed">
          Access powerful AI-driven food forecasting, detailed dish recommendations, ingredient substitutions, and creative leftover utilization ideas.
          These advanced tools are designed to help you minimize waste and maximize efficiency in your kitchen.
        </p>
        <button
          onClick={() => setCurrentPage('login')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
        >
          Login to Access Features
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </>
  );
}

// New ForecastingPage component to hold ForecastForm and AI tools
function ForecastingPage({
  fetchForecast, loadingForecast, errorForecast, forecastResult,
  currentEventDetails, copyToClipboard,
  generateRecipeSuggestions, loadingRecipes, errorRecipes, recipeSuggestions,
  ingredientToSubstitute, setIngredientToSubstitute, generateSubstitutionSuggestions, loadingSubstitutions, errorSubstitutions, substitutionSuggestions,
  generateLeftoverSuggestions, loadingLeftovers, errorLeftovers, leftoverSuggestions
}) {
  return (
    <div className="w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 sm:mb-8 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Food Forecasting & AI Tools
        </span>
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
        Utilize our AI-powered features to predict food needs accurately and minimize waste.
      </p>
      <ForecastForm onSubmit={fetchForecast} loading={loadingForecast} />

      {loadingForecast && (
        <div className="flex items-center justify-center mt-6 text-blue-600 font-medium">
          <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Forecasting...
        </div>
      )}
      {errorForecast && (
        <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-sm">
          {errorForecast}
        </div>
      )}

      {/* Forecast Display Section */}
      {forecastResult && (
        <ForecastDisplay
          result={forecastResult}
          eventDetails={currentEventDetails}
          copyToClipboard={copyToClipboard}
        />
      )}

      {/* AI Tools Section - Correctly placed within ForecastingPage */}
      {forecastResult && ( // Only show AI tools if a forecast has been made
        <div className="mt-8 p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 text-center">AI-Powered Kitchen Tools 🧠</h3>
          <p className="text-base text-gray-700 mb-6 text-center leading-relaxed">
            Leverage AI to get smart suggestions based on your forecast.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={generateRecipeSuggestions}
              className="w-full sm:w-auto inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out transform hover:scale-105"
              disabled={loadingRecipes}
            >
              {loadingRecipes ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Recipes...
                </>
              ) : (
                'Generate ✨ Recipe Suggestions ✨'
              )}
            </button>
            <button
              onClick={generateLeftoverSuggestions}
              className="w-full sm:w-auto inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out transform hover:scale-105"
              disabled={loadingLeftovers}
            >
              {loadingLeftovers ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Leftover Ideas...
                </>
              ) : (
                'Get ✨ Leftover Ideas ✨'
              )}
            </button>
          </div>
          {errorRecipes && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-sm">
              {errorRecipes}
            </div>
          )}
          {recipeSuggestions && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-gray-800 rounded-lg shadow-sm max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-blue-700 mb-2">Recipe Suggestions:</h4>
              <p className="whitespace-pre-wrap">{recipeSuggestions}</p>
              <button
                onClick={() => copyToClipboard(recipeSuggestions)}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition"
              >
                Copy
              </button>
            </div>
          )}
          {errorLeftovers && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-sm">
              {errorLeftovers}
            </div>
          )}
          {leftoverSuggestions && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-gray-800 rounded-lg shadow-sm max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-blue-700 mb-2">Leftover Utilization Ideas:</h4>
              <p className="whitespace-pre-wrap">{leftoverSuggestions}</p>
              <button
                onClick={() => copyToClipboard(leftoverSuggestions)}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition"
              >
                Copy
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-300">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 text-center">Need an Ingredient Substitution?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="text"
                placeholder="e.g., 'butter', 'flour', 'sugar'"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                value={ingredientToSubstitute}
                onChange={(e) => setIngredientToSubstitute(e.target.value)}
              />
              <button
                onClick={generateSubstitutionSuggestions}
                className="w-full sm:w-auto inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out transform hover:scale-105"
                disabled={loadingSubstitutions}
              >
                {loadingSubstitutions ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Substitutions...
                  </>
                ) : (
                  'Get ✨ Ingredient Substitutions ✨'
                )}
              </button>
            </div>
            {errorSubstitutions && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-sm">
                {errorSubstitutions}
              </div>
            )}
            {substitutionSuggestions && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-gray-800 rounded-lg shadow-sm max-h-60 overflow-y-auto">
                <h4 className="font-semibold text-blue-700 mb-2">Substitution Suggestions for "{ingredientToSubstitute}":</h4>
                <p className="whitespace-pre-wrap">{substitutionSuggestions}</p>
                <button
                  onClick={() => copyToClipboard(substitutionSuggestions)}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// Component for the forecasting input form.
// This component handles user input for event details and triggers the forecast.
function ForecastForm({ onSubmit, loading }) {
  const [eventType, setEventType] = useState('');
  const [audienceProfile, setAudienceProfile] = useState('');
  const [footfall, setFootfall] = useState('');
  const [date, setDate] = useState('');
  const [formError, setFormError] = useState(null); // State for form-specific validation errors.

  // Handles form submission, performs basic validation, and calls the onSubmit prop.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    setFormError(null); // Clear any previous form errors.
    // Basic client-side validation.
    if (!eventType || !audienceProfile || !footfall || !date) {
      setFormError("Please fill in all fields.");
      return;
    }
    // Call the onSubmit prop, passing the collected event details.
    onSubmit({ eventType, audienceProfile, footfall: parseInt(footfall), date });
  };

  // Function to clear all form fields.
  const handleClearForm = () => {
    setEventType('');
    setAudienceProfile('');
    setFootfall('');
    setDate('');
    setFormError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4 sm:mb-6">Forecast New Event</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select
            id="eventType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="">Select an event type</option>
            <option value="Holiday Party">Holiday Party</option>
            <option value="Corporate Lunch">Corporate Lunch</option>
            <option value="Weekend Brunch">Weekend Brunch</option>
            <option value="Birthday Celebration">Birthday Celebration</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="audienceProfile" className="block text-sm font-medium text-gray-700 mb-1">Audience Profile</label>
          <select
            id="audienceProfile"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={audienceProfile}
            onChange={(e) => setAudienceProfile(e.target.value)}
            required
          >
            <option value="">Select audience profile</option>
            <option value="Mixed">Mixed</option>
            <option value="Professionals">Professionals</option>
            <option value="Families">Families</option>
            <option value="Young Adults">Young Adults</option>
            <option value="Students">Students</option>
          </select>
        </div>
        <div>
          <label htmlFor="footfall" className="block text-sm font-medium text-gray-700 mb-1">Expected Footfall</label>
          <input
            type="number"
            id="footfall"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={footfall}
            onChange={(e) => setFootfall(e.target.value)}
            min="1"
            required
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4"> {/* Buttons stacked on mobile, side-by-side on larger screens */}
        <button
          type="submit"
          className="w-full sm:w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
          disabled={loading} // Disable button while loading.
        >
          {loading ? 'Forecasting...' : 'Get Forecast'}
        </button>
        <button
          type="button" // Important: use type="button" to prevent form submission
          onClick={handleClearForm}
          className="w-full sm:w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          Clear Form
        </button>
      </div>
      {formError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-sm">
          {formError}
        </div>
      )}
    </form>
  );
}

/**
 * Helper function to generate a detailed dish recommendation based on forecast and event details.
 * This simulates a more intelligent output that would typically come from a backend.
 * @param {number} predictedFoodQuantity - The total food quantity predicted (in 'units').
 * @param {object} eventDetails - Details of the event (eventType, footfall).
 * @returns {object} An object containing dish name, description, and ingredient breakdown.
 */
const generateDetailedDishRecommendation = (predictedFoodQuantity, eventDetails) => {
  let dishName = "Custom Meal";
  let description = "A versatile meal suitable for various events.";
  let baseServings = 10; // Base servings for our example dish
  let ingredients = [
    { name: 'Protein (e.g., Chicken Breast)', baseKg: 1.0, proportion: '40%' },
    { name: 'Staple (e.g., Rice)', baseKg: 0.8, proportion: '30%' },
    { name: 'Vegetables (mixed)', baseKg: 0.5, proportion: '20%' },
    { name: 'Sauce/Flavorings', baseKg: 0.2, proportion: '10%' },
  ];

  // Adjust dish based on event type for a more "problem-solver" feel
  switch (eventDetails.eventType) {
    case 'Holiday Party':
      dishName = "Festive Roast Chicken with Root Vegetables";
      description = "A hearty and crowd-pleasing dish, perfect for holiday gatherings. Focuses on balanced nutrition and easy scaling.";
      ingredients = [
        { name: 'Whole Chicken', baseKg: 1.2, proportion: '45%' },
        { name: 'Potatoes', baseKg: 0.7, proportion: '25%' },
        { name: 'Carrots & Parsnips', baseKg: 0.4, proportion: '15%' },
        { name: 'Herbs & Spices', baseKg: 0.1, proportion: '5%' },
        { name: 'Broth/Stock', baseKg: 0.2, proportion: '10%' },
      ];
      baseServings = 8; // A whole chicken might serve 6-8 people
      break;
    case 'Corporate Lunch':
      dishName = "Chicken and Vegetable Stir-fry with Noodles";
      description = "A quick, customizable, and efficient meal for a professional setting, minimizing prep time and maximizing flavor.";
      ingredients = [
        { name: 'Chicken Breast (sliced)', baseKg: 0.7, proportion: '35%' },
        { name: 'Mixed Stir-fry Vegetables', baseKg: 0.8, proportion: '40%' },
        { name: 'Egg Noodles', baseKg: 0.4, proportion: '20%' },
        { name: 'Stir-fry Sauce', baseKg: 0.1, proportion: '5%' },
      ];
      baseServings = 5; // A stir-fry is often made in smaller batches
      break;
    case 'Weekend Brunch':
      dishName = "Hearty Breakfast Burrito Bar";
      description = "An interactive and satisfying option for a brunch crowd, allowing guests to customize their plates and reducing individual portioning effort.";
      ingredients = [
        { name: 'Scrambled Eggs', baseKg: 0.6, proportion: '30%' },
        { name: 'Breakfast Sausage/Bacon', baseKg: 0.4, proportion: '20%' },
        { name: 'Potatoes (diced & roasted)', baseKg: 0.5, proportion: '25%' },
        { name: 'Tortillas', baseKg: 0.3, proportion: '15%' },
        { name: 'Salsa & Cheese', baseKg: 0.2, proportion: '10%' },
      ];
      baseServings = 6;
      break;
    case 'Birthday Celebration':
      dishName = "Mini Sliders and Fries";
      description = "A fun and easy-to-eat option for a celebration, perfect for casual mingling and catering to diverse tastes with simple ingredients.";
      ingredients = [
        { name: 'Ground Beef (for patties)', baseKg: 0.8, proportion: '40%' },
        { name: 'Slider Buns', baseKg: 0.4, proportion: '20%' },
        { name: 'Cheese Slices', baseKg: 0.2, proportion: '10%' },
        { name: 'Lettuce, Tomato, Onion', baseKg: 0.2, proportion: '10%' },
        { name: 'Fries (frozen)', baseKg: 0.4, proportion: '20%' },
      ];
      baseServings = 10; // Assumes 2-3 sliders per person
      break;
    default:
      // Keep default for 'Other' or unhandled types
      break;
  }

  // Calculate scaling factor based on predicted food quantity and a rough estimate of "units" per serving.
  // Assuming 1 "unit" from the forecast roughly corresponds to 0.5 kg of prepared food for simplicity.
  const totalFoodKg = predictedFoodQuantity * 0.5;
  const scalingFactor = totalFoodKg / baseServings; // Scale based on total kg needed for the event

  const adjustedIngredients = ingredients.map(item => ({
    name: item.name,
    quantity: (item.baseKg * scalingFactor).toFixed(2), // Calculate and round to 2 decimal places
    unit: 'kg',
    proportion: item.proportion,
  }));

  // Add problem-solving insights
  const problemSolvingInsights = `
    This detailed breakdown helps you:
    1.  **Prevent Over-preparation:** By knowing exact quantities for each ingredient, you avoid buying or preparing too much, directly reducing food waste.
    2.  **Optimize Ingredient Use:** The proportions guide you in balancing flavors and textures, ensuring a delicious outcome without excess.
    3.  **Streamline Shopping:** With weights in kilograms, you can easily purchase the precise amount needed, saving time and money.
    4.  **Simplify Scaling:** This structure makes it easy to scale the recipe up or down for future events by simply adjusting the total food quantity.
  `;

  return {
    dishName,
    description,
    adjustedIngredients,
    problemSolvingInsights,
    estimatedServings: (totalFoodKg / (totalFoodKg / predictedFoodQuantity)).toFixed(0) // Re-calculate estimated servings based on kg
  };
};


// Component to display the forecast result and detailed dish recommendations.
function ForecastDisplay({
  result,
  eventDetails,
  copyToClipboard
}) {
  // Generate detailed dish recommendation based on forecast and event details
  const dishRecommendation = generateDetailedDishRecommendation(result.predictedFoodQuantity, eventDetails);

  return (
    <div className="mt-8 p-4 sm:p-6 bg-green-50 rounded-xl shadow-lg border border-green-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 text-center">Forecasted Preparation Needs</h2>
      <div className="text-center">
        <p className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-4">
          {result.predictedFoodQuantity}
          <span className="text-lg sm:text-xl text-gray-600 ml-2">units</span>
        </p>
        {result.wasteReductionPotential !== undefined && (
          <p className="text-base sm:text-lg text-gray-700 mt-2 font-medium">
            Potential waste reduction compared to a simple estimate: <span className="font-bold text-green-700">{result.wasteReductionPotential} units</span>
          </p>
        )}
      </div>

      {/* Detailed Dish Recommendation Section */}
      <div className="mt-8 pt-6 border-t border-gray-300">
        <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4 text-center">🍽️ Detailed Dish Recommendation: {dishRecommendation.dishName} 🍽️</h3>
        <p className="text-base text-gray-700 mb-4 text-center leading-relaxed">
          {dishRecommendation.description}
        </p>
        <p className="text-base text-gray-700 mb-4 text-center font-semibold">
          Estimated servings for this event: {dishRecommendation.estimatedServings}
        </p>

        <div className="bg-blue-100 p-4 rounded-xl shadow-md mb-4">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Ingredient Breakdown:</h4>
          <ul className="list-disc list-inside text-gray-800 text-base leading-relaxed">
            {dishRecommendation.adjustedIngredients.map((item, index) => (
              <li key={index} className="mb-1">
                <span className="font-medium">{item.name}:</span> {item.quantity} {item.unit} ({item.proportion})
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow-md">
          <h4 className="text-lg font-semibold text-green-800 mb-2">💡 Problem-Solving Insights:</h4>
          {/* Explicitly apply font-inter to each paragraph */}
          <div className="prose max-w-none text-gray-800 text-base leading-relaxed">
            {dishRecommendation.problemSolvingInsights.split('\n').map((line, index) => (
              <p key={index} className="mb-1 font-inter">{line}</p>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => copyToClipboard(`Dish: ${dishRecommendation.dishName}\n\nIngredients:\n${dishRecommendation.adjustedIngredients.map(item => `${item.name}: ${item.quantity} ${item.unit} (${item.proportion})`).join('\n')}\n\nProblem-Solving Insights:\n${dishRecommendation.problemSolvingInsights}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1.5M9 3l2-2 2 2M9 3h6M9 3V1m6 2v2" />
            </svg>
            Copy Dish Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Component for displaying Historical Data
function HistoricalDataPage({ historicalData }) {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 text-center">Our Historical Data</h2>
      <p className="text-base text-gray-600 mb-6 text-center leading-relaxed">
        This data helps our forecasting model understand past event patterns for more accurate predictions.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['Date', 'Event Type', 'Audience', 'Footfall', 'Prepared', 'Consumed'].map((header) => (
                <th key={header} className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historicalData.map((data, index) => (
              <tr key={index}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{data.date}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{data.eventType}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{data.audienceProfile}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{data.footfall}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{data.foodPrepared}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{data.foodConsumed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-6 text-center">
        (Note: This is mock data for demonstration purposes. In a real system, this would be dynamic and user-managed.)
      </p>
    </div>
  );
}

// Component for Inventory Management
function InventoryPage({ inventory, setInventory, showMessage }) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemMinStock, setNewItemMinStock] = useState('');
  const [editItemId, setEditItemId] = useState(null);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemName && newItemQuantity && newItemUnit && newItemMinStock) {
      const newItem = {
        id: inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1,
        name: newItemName,
        quantity: parseInt(newItemQuantity),
        unit: newItemUnit,
        minStock: parseInt(newItemMinStock),
      };
      setInventory([...inventory, newItem]);
      showMessage('Item added to inventory!');
      setNewItemName('');
      setNewItemQuantity('');
      setNewItemUnit('');
      setNewItemMinStock('');
    } else {
      showMessage('Please fill all fields to add an item.', 4000);
    }
  };

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    showMessage('Item deleted from inventory!');
  };

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setNewItemUnit(item.unit);
    setNewItemMinStock(item.minStock);
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    if (newItemName && newItemQuantity && newItemUnit && newItemMinStock && editItemId) {
      setInventory(inventory.map(item =>
        item.id === editItemId
          ? { ...item, name: newItemName, quantity: parseInt(newItemQuantity), unit: newItemUnit, minStock: parseInt(newItemMinStock) }
          : item
      ));
      showMessage('Inventory item updated!');
      setEditItemId(null);
      setNewItemName('');
      setNewItemQuantity('');
      setNewItemUnit('');
      setNewItemMinStock('');
    } else {
      showMessage('Please fill all fields to update item.', 4000);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-yellow-50 rounded-xl shadow-lg border border-yellow-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-yellow-700 mb-4 text-center">Inventory Management</h2>
      <p className="text-base text-gray-700 mb-6 text-center leading-relaxed">
        Track your ingredients, monitor stock levels, and identify items needing reorder.
      </p>

      {/* Add/Edit Item Form */}
      <form onSubmit={editItemId ? handleUpdateItem : handleAddItem} className="mb-8 p-4 bg-yellow-100 rounded-md shadow-md">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">{editItemId ? 'Edit Item' : 'Add New Item'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            min="0"
            required
          />
          <input
            type="text"
            placeholder="Unit (e.g., kg, pcs)"
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <input
            type="number"
            placeholder="Min Stock Level"
            value={newItemMinStock}
            onChange={(e) => setNewItemMinStock(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            min="0"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition duration-150 ease-in-out transform hover:scale-105"
        >
          {editItemId ? 'Update Item' : 'Add Item'}
        </button>
        {editItemId && (
          <button
            type="button"
            onClick={() => {
              setEditItemId(null);
              setNewItemName('');
              setNewItemQuantity('');
              setNewItemUnit('');
              setNewItemMinStock('');
            }}
            className="w-full py-2 px-4 mt-2 border border-gray-300 rounded-full shadow-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Inventory List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
              <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-2 whitespace-nowrap text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity} {item.unit}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.minStock} {item.unit}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.quantity < item.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.quantity < item.minStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEditItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-6 text-center">
        (Note: Inventory data is mock for demonstration. In a real system, this would be persistent and managed via a backend.)
      </p>
    </div>
  );
}

// Component for Reports and Analytics
function ReportsPage() {
  return (
    <div className="p-4 sm:p-6 bg-purple-50 rounded-xl shadow-lg border border-purple-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-purple-700 mb-4 text-center">Reports & Analytics</h2>
      <p className="text-base mb-6 text-center leading-relaxed">
        Gain insights into your kitchen's performance, waste reduction, and popular items.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Waste Reduction Trends</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            (Placeholder for a chart showing waste reduction over time)
            <img src="https://placehold.co/300x150/E0E7FF/4338CA?text=Waste+Chart" alt="Waste Reduction Chart Placeholder" className="w-full h-auto rounded-md mt-2" />
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Forecasting Accuracy</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            (Placeholder for a chart showing forecast vs. actual consumption)
            <img src="https://placehold.co/300x150/E0E7FF/4338CA?text=Accuracy+Chart" alt="Forecasting Accuracy Chart Placeholder" className="w-full h-auto rounded-md mt-2" />
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Popular Event Types</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            (Placeholder for a list or chart of most popular event types)
            <img src="https://placehold.co/600x100/E0E7FF/4338CA?text=Popular+Events+List" alt="Popular Events Placeholder" className="w-full h-auto rounded-md mt-2" />
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6 text-center">
        (Note: Reports are mock for demonstration. Real reports would be generated from persistent data.)
      </p>
    </div>
  );
}

// Component for Feedback Loop
function FeedbackPage() {
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [actualFootfall, setActualFootfall] = useState('');
  const [actualConsumed, setActualConsumed] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setFeedbackMessage(null);
    if (!eventType || !date || !actualFootfall || !actualConsumed) {
      setFeedbackMessage('Please fill all fields.');
      return;
    }
    // In a real application, this data would be sent to the backend
    // to update historical records and potentially retrain the ML model.
    console.log('Feedback submitted:', { eventType, date, actualFootfall, actualConsumed });
    setFeedbackMessage('Thank you for your feedback! This data helps improve our forecasts.');
    setEventType('');
    setDate('');
    setActualFootfall('');
    setActualConsumed('');
  };

  return (
    <div className="p-4 sm:p-6 bg-indigo-50 rounded-xl shadow-lg border border-indigo-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-4 text-center">Provide Feedback</h2>
      <p className="text-base mb-6 text-center leading-relaxed">
        Help us improve forecasting accuracy by providing actual consumption data after an event.
      </p>
      <form onSubmit={handleSubmitFeedback} className="p-4 bg-indigo-100 rounded-md shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="feedbackEventType" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              id="feedbackEventType"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
            >
              <option value="">Select an event type</option>
              <option value="Holiday Party">Holiday Party</option>
              <option value="Corporate Lunch">Corporate Lunch</option>
              <option value="Weekend Brunch">Weekend Brunch</option>
              <option value="Birthday Celebration">Birthday Celebration</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="feedbackDate" className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input
              type="date"
              id="feedbackDate"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="actualFootfall" className="block text-sm font-medium text-gray-700 mb-1">Actual Footfall</label>
            <input
              type="number"
              id="actualFootfall"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              value={actualFootfall}
              onChange={(e) => setActualFootfall(e.target.value)}
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="actualConsumed" className="block text-sm font-medium text-gray-700 mb-1">Actual Food Consumed (units)</label>
            <input
              type="number"
              id="actualConsumed"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              value={actualConsumed}
              onChange={(e) => setActualConsumed(e.target.value)}
              min="0"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-105"
        >
          Submit Feedback
        </button>
        {feedbackMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center shadow-sm">
            {feedbackMessage}
          </div>
        )}
      </form>
      <p className="text-sm text-gray-500 mt-6 text-center">
        (Note: This form simulates data collection for future model improvements. Data is not persistently stored in this demo.)
      </p>
    </div>
  );
}

// Component for User Settings
function SettingsPage({ currentUsername, userRole }) {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 text-center">User Settings</h2>
      <p className="text-base mb-6 text-center leading-relaxed">
        Manage your profile and application preferences.
      </p>
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username:</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">{currentUsername}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role:</label>
          <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{userRole}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input type="email" value="user@example.com" readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Preferred Unit:</label>
          <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm">
            <option>kg</option>
            <option>grams</option>
            <option>lbs</option>
            <option>units</option>
          </select>
        </div>
        <button className="w-full py-2 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out transform hover:scale-105">
          Save Settings (Mock)
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-6 text-center">
        (Note: Settings are mock for demonstration. Real settings would be persistent and managed via a backend.)
      </p>
    </div>
  );
}

// Component for the About Us page
function AboutUsPage() {
  return (
    <div className="p-4 sm:p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4 text-center">About AI-Powered Kitchen</h2>
      <p className="text-base mb-4 leading-relaxed">
        AI-Powered Kitchen is a project developed by **Cookie Code** with the mission to combat food waste and enhance efficiency in food preparation. We believe that technology, especially Artificial Intelligence, can play a pivotal role in creating more sustainable and profitable kitchens.
      </p>
      <p className="text-base mb-4 leading-relaxed">
        Our application provides intelligent forecasting to help you prepare just the right amount of food, reducing excess. Beyond forecasting, our integrated AI offers creative recipe suggestions, smart ingredient substitutions for dietary needs or availability, and innovative ideas to utilize leftovers, ensuring a zero-waste approach.
      </p>
      <p className="text-base leading-relaxed">
        We are passionate about leveraging cutting-edge technology to solve real-world problems and contribute to a greener planet.
      </p>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">Our Goal:</h3>
        <p className="text-base">
          Empowering kitchens with AI for efficiency, sustainability, and reduced waste.
        </p>
      </div>
    </div>
  );
}

// Component for a mock Login Page
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chef'); // Default role for convenience

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password, role);
  };

  return (
    <div className="p-4 sm:p-6 bg-green-50 rounded-xl shadow-lg border border-green-200">
      <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-6 text-center">Login / Select Role</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username (e.g., chef1, manager1, admin1)</label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password (any)</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
          <select
            id="role"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="chef">Chef</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-6 text-center">
        (Note: This is a mock login for demonstration. Use any username/password. Role selection determines access to certain features.)
      </p>
    </div>
  );
}

// New component for the Fridge Tetris Game
function FridgeTetrisGame() {
  const GRID_ROWS = 10; // Height of the fridge grid
  const GRID_COLS = 6;  // Width of the fridge grid
  const CELL_SIZE = 30; // Size of each grid cell in pixels

  // Define Tetris-like shapes for food items with names and colors
  const SHAPES = [
    { name: 'Milk Carton', shape: [[1,1]], color: '#A7F3D0', icon: '🥛' }, // 1x1 block for simplicity
    { name: 'Butter Block', shape: [[1,1],[1,1]], color: '#FCD34D', icon: '🧈' }, // 2x1 block
    { name: 'Pizza Box', shape: [[1,1,1],[1,1,1]], color: '#FCA5A5', icon: '🍕' }, // 3x2 block
    { name: 'Eggs', shape: [[1,1,1,1]], color: '#FDE68A', icon: '🥚' }, // 4x1 block
    { name: 'Soda Can', shape: [[1]], color: '#93C5FD', icon: '🥤' }, // 1x1 block
    { name: 'Veggie Bag', shape: [[1,1],[1,0]], color: '#BFDBFE', icon: '🥬' }, // L-shape
    { name: 'Fruit Bowl', shape: [[1,1,0],[0,1,1]], color: '#D8B4FE', icon: '🍎' }, // Z-shape
  ];

  // State for the game board (fridge grid)
  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null))
  );
  // State for the score (filled cells)
  const [score, setScore] = useState(0);
  // State for the list of available items to place
  const [availableItems, setAvailableItems] = useState([]);
  // State for the currently selected item to place
  const [selectedItem, setSelectedItem] = useState(null);
  // State for game messages
  const [gameMessage, setGameMessage] = useState('');

  // Initializes the game with a fresh grid and random items
  const initializeGame = () => {
    setGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null)));
    setScore(0);
    setGameMessage('Select an item and click on the fridge to place it!');

    // Populate available items with a random selection
    const itemsToGenerate = 5 + Math.floor(Math.random() * 5); // 5 to 9 items
    const newAvailableItems = [];
    for (let i = 0; i < itemsToGenerate; i++) {
      newAvailableItems.push({
        ...SHAPES[Math.floor(Math.random() * SHAPES.length)],
        id: Date.now() + i // Unique ID for each item instance
      });
    }
    setAvailableItems(newAvailableItems);
    setSelectedItem(null); // No item selected initially
  };

  useEffect(() => {
    initializeGame(); // Initialize game when component mounts
  }, []);

  // Handles clicking a cell on the grid to place the selected item
  const handleGridClick = (row, col) => {
    if (!selectedItem) {
      setGameMessage('Please select an item first!');
      return;
    }

    const { shape, name, color, icon } = selectedItem;
    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;

    // Check if the item can be placed at the clicked position
    let canPlace = true;
    if (row + shapeHeight > GRID_ROWS || col + shapeWidth > GRID_COLS) {
      canPlace = false; // Out of bounds
    } else {
      for (let r = 0; r < shapeHeight; r++) {
        for (let c = 0; c < shapeWidth; c++) {
          if (shape[r][c] === 1 && grid[row + r][col + c] !== null) {
            canPlace = false; // Overlapping with another item
            break;
          }
        }
        if (!canPlace) break;
      }
    }

    if (canPlace) {
      const newGrid = grid.map(rowArr => [...rowArr]); // Deep copy of the grid
      let cellsFilled = 0;
      for (let r = 0; r < shapeHeight; r++) {
        for (let c = 0; c < shapeWidth; c++) {
          if (shape[r][c] === 1) {
            newGrid[row + r][col + c] = { name, color, icon };
            cellsFilled++;
          }
        }
      }
      setGrid(newGrid);
      setScore(prevScore => prevScore + cellsFilled); // Update score
      setAvailableItems(prevItems => prevItems.filter(item => item.id !== selectedItem.id)); // Remove placed item
      setSelectedItem(null); // Deselect item
      setGameMessage(`Placed ${name}! Choose another item.`);
    } else {
      setGameMessage('Cannot place item here! Try another spot or rotate if applicable.');
    }
  };

  // Calculates the current space utilization percentage
  const calculateUtilization = () => {
    const totalCells = GRID_ROWS * GRID_COLS;
    const filledCells = grid.flat().filter(cell => cell !== null).length;
    return totalCells > 0 ? ((filledCells / totalCells) * 100).toFixed(1) : 0;
  };

  // Handles selecting an item from the available list
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setGameMessage(`Selected ${item.name}. Now click on the fridge to place it.`);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-inner">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Organize Your Fridge!</h3>
      <div className="flex justify-center items-start flex-wrap gap-4 w-full">
        {/* Available Items Section */}
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 w-full sm:w-1/3 min-w-[200px]">
          <h4 className="text-lg font-medium text-gray-700 mb-3">Items to Place:</h4>
          {availableItems.length === 0 && (
            <p className="text-green-600 font-semibold mb-2">All items placed! Well done!</p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {availableItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`flex items-center justify-center p-2 rounded-md border-2 transition transform hover:scale-105
                  ${selectedItem && selectedItem.id === item.id ? 'border-blue-500 shadow-lg' : 'border-gray-300'}
                  bg-white text-gray-800 text-sm font-medium`}
                style={{ backgroundColor: selectedItem && selectedItem.id === item.id ? 'rgba(147, 197, 253, 0.3)' : '#fff' }} // Subtle highlight
              >
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fridge Grid Section */}
        <div className="flex flex-col items-center">
          <div
            className="grid gap-px border-2 border-gray-400 bg-gray-300 rounded-lg overflow-hidden relative"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
              width: GRID_COLS * CELL_SIZE + GRID_COLS - 1, // Add gap pixels
              height: GRID_ROWS * CELL_SIZE + GRID_ROWS - 1, // Add gap pixels
            }}
          >
            {grid.map((rowArr, rowIndex) =>
              rowArr.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-full h-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: cell ? cell.color : '#E2E8F0', border: '1px solid #CBD5E0' }} // Light gray for empty, color for filled
                  onClick={() => handleGridClick(rowIndex, colIndex)}
                >
                  {cell ? cell.icon : ''}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Game Info and Controls */}
      <div className="mt-6 w-full text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">Score: {score} cells filled</p>
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Space Utilization: <span className="text-blue-600">{calculateUtilization()}%</span>
        </p>
        <p className="text-base text-gray-600 mb-4 font-medium">{gameMessage}</p>
        <button
          onClick={initializeGame}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
        >
          Reset Fridge
        </button>
      </div>
    </div>
  );
}

export default App;
