const weatherResult = document.getElementById('weather-result');
const getWeatherButton = document.getElementById('get-weather');
const cityInput = document.getElementById('city-input');

// Ensure the button is selected correctly and can work with the click event
if (getWeatherButton) {
  console.log('Button is selected correctly');
} else {
  console.log('Button is not found');
}

// Event listener for the button click
getWeatherButton.addEventListener('click', () => {
  const city = cityInput.value.trim();  // Ensure input field is not empty
  if (city) {
    console.log('Button clicked, city:', city);
    fetchWeather(city);
  } else {
    weatherResult.innerHTML = '<p>Please enter a city name.</p>';
  }
});

// Fetch Weather Data from Open-Meteo (no API key needed)
async function fetchWeather(city) {
  try {
    // Get city information (latitude and longitude) from the geocoding API
    const cityResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=en`);
    if (!cityResponse.ok) throw new Error('City not found');
    const cityData = await cityResponse.json();

    // Get latitude and longitude from the search response
    const latitude = cityData.results[0].latitude;
    const longitude = cityData.results[0].longitude;

    // Fetch the weather information from the Open-Meteo API using coordinates
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode`);
    if (!response.ok) throw new Error('Unable to fetch weather data');

    const weatherData = await response.json();
    displayWeather(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherResult.innerHTML = `<p>${error.message}</p>`;  // Display the error on the UI
  }
}

// Display the weather information on the webpage
function displayWeather(data) {
  const currentWeather = data.hourly;
  const temperature = currentWeather.temperature_2m[0];
  const weatherCode = currentWeather.weathercode[0];
  
  // Simple check for clear or cloudy weather based on weather code
  const weatherDescription = weatherCode === 0 ? 'Clear' : 'Cloudy';

  weatherResult.innerHTML = `
    <h3>Weather Forecast</h3>
    <p>Temperature: ${temperature}°C</p>
    <p>Condition: ${weatherDescription}</p>
  `;
}
