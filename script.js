const API_KEY = '588970ca71cf2c6bed61d21ea73f901f'; // Замініть на свій API-ключ
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

document.querySelector('.current-city__search-bar input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather(this.value);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}&lang=ua`);
        const data = await response.json();
        
        if (response.ok) {
            updateWeatherUI(data);
            getForecast(city);
        } else {
            alert('Місто не знайдено');
        }
    } catch (error) {
        console.error('Помилка отримання даних:', error);
    }
}

function updateWeatherUI(data) {
    document.getElementById('current-city__city-name').textContent = data.name;
    document.getElementById('current-city__rain-chance').textContent = `Chance of rain: ${data.clouds.all}%`;
    document.getElementById('current-city__temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.real-feel').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.querySelector('.wind').textContent = `${data.wind.speed} km/h`;
    document.querySelector('.uv-index').textContent = 'N/A'; // UV Index потребує іншого API виклику
    document.getElementById('current-city__weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('current-city__weather-icon').alt = data.weather[0].description;
}

async function getForecast(city) {
    try {
        const response = await fetch(`${BASE_URL}forecast?q=${city}&units=metric&appid=${API_KEY}&lang=ua`);
        const data = await response.json();
        
        if (response.ok) {
            updateForecastUI(data);
        }
    } catch (error) {
        console.error('Помилка отримання прогнозу:', error);
    }
}

function updateForecastUI(data) {
    const hourlyForecast = document.querySelector('.current-city__hourly-forecast');
    hourlyForecast.innerHTML = '';
    
    for (let i = 0; i < 5; i++) { // Беремо 5 найближчих прогнозів
        const forecast = data.list[i];
        const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        hourlyForecast.innerHTML += `
            <div class="forecast-item">
                <p>${time}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
                <p>${Math.round(forecast.main.temp)}°C</p>
            </div>
        `;
    }
    
    const weeklyForecast = document.querySelector('.current-city__weekly-forecast-text');
    weeklyForecast.innerHTML = '';
    
    for (let i = 0; i < data.list.length; i += 8) { // Кожен 8-й запис — прогноз на наступний день
        const forecast = data.list[i];
        const day = new Date(forecast.dt * 1000).toLocaleDateString('uk-UA', { weekday: 'long' });
        
        weeklyForecast.innerHTML += `
            <div class="forecast-item">
                <p>${day}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
                <p>${Math.round(forecast.main.temp)}°C</p>
            </div>
        `;
    }
}