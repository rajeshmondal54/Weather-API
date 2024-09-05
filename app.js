const fetchDataBtn = document.getElementById('fetchDataBtn');
const weatherDataDiv = document.getElementById('weatherData');
const mapDiv = document.getElementById('map');
const landingPage = document.getElementById('landingPage');
const weatherInfo = document.getElementById('weatherInfo');
const latitudeSpan = document.getElementById('latitude');
const longitudeSpan = document.getElementById('longitude');

fetchDataBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        latitudeSpan.textContent = lat.toFixed(6);
        longitudeSpan.textContent = lon.toFixed(6);
        
        landingPage.classList.add('hidden');
        weatherInfo.classList.remove('hidden');
        
        displayMap(lat, lon);
        fetchWeatherData(lat, lon);
      },
      (error) => {
        weatherDataDiv.innerHTML = 'Error fetching location. Please allow location access.';
      }
    );
  } else {
    weatherDataDiv.innerHTML = 'Geolocation is not supported by this browser.';
  }
});

function displayMap(lat, lon) {
  const mapOptions = {
    center: { lat, lng: lon },
    zoom: 12,
  };
  const map = new google.maps.Map(mapDiv, mapOptions);
  new google.maps.Marker({
    position: { lat, lng: lon },
    map: map,
  });
}

async function fetchWeatherData(lat, lon) {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');

    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    weatherDataDiv.innerHTML = `Error fetching weather data: ${error.message}`;
  }
}

function displayWeatherData(data) {
  const { temp, humidity, wind_speed, pressure, uvi, feels_like, weather } = data.current;
  const weatherDescription = weather[0].description;
  const timezone = data.timezone;

  weatherDataDiv.innerHTML = `
    <div class="weather-item">Location: ${timezone}</div>
    <div class="weather-item">Temperature: ${temp} °C</div>
    <div class="weather-item">Feels Like: ${feels_like} °C</div>
    <div class="weather-item">Humidity: ${humidity} %</div>
    <div class="weather-item">Wind Speed: ${wind_speed} km/h</div>
    <div class="weather-item">Pressure: ${pressure} hPa</div>
    <div class="weather-item">UV Index: ${uvi}</div>
    <div class="weather-item">Condition: ${weatherDescription}</div>
  `;
}
