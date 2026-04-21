// Open-Meteo uses WMO Weather interpretation codes
// We map these codes to beautiful Phosphor Icons and CSS classes for dynamic backgrounds
const weatherCodeMap = {
    0: { label: 'Clear sky', icon: 'ph-sun', class: 'weather-clear' },
    1: { label: 'Mainly clear', icon: 'ph-cloud-sun', class: 'weather-clear' },
    2: { label: 'Partly cloudy', icon: 'ph-cloud', class: 'weather-cloudy' },
    3: { label: 'Overcast', icon: 'ph-clouds', class: 'weather-cloudy' },
    45: { label: 'Fog', icon: 'ph-cloud-fog', class: 'weather-cloudy' },
    48: { label: 'Depositing rime fog', icon: 'ph-cloud-fog', class: 'weather-cloudy' },
    51: { label: 'Light drizzle', icon: 'ph-cloud-rain', class: 'weather-rain' },
    53: { label: 'Moderate drizzle', icon: 'ph-cloud-rain', class: 'weather-rain' },
    55: { label: 'Dense drizzle', icon: 'ph-cloud-rain', class: 'weather-rain' },
    61: { label: 'Slight rain', icon: 'ph-cloud-rain', class: 'weather-rain' },
    63: { label: 'Moderate rain', icon: 'ph-cloud-rain', class: 'weather-rain' },
    65: { label: 'Heavy rain', icon: 'ph-cloud-rain', class: 'weather-rain' },
    71: { label: 'Slight snow', icon: 'ph-snowflake', class: 'weather-snow' },
    73: { label: 'Moderate snow', icon: 'ph-snowflake', class: 'weather-snow' },
    75: { label: 'Heavy snow', icon: 'ph-snowflake', class: 'weather-snow' },
    77: { label: 'Snow grains', icon: 'ph-snowflake', class: 'weather-snow' },
    80: { label: 'Slight rain showers', icon: 'ph-cloud-rain', class: 'weather-rain' },
    81: { label: 'Moderate rain showers', icon: 'ph-cloud-rain', class: 'weather-rain' },
    82: { label: 'Violent rain showers', icon: 'ph-cloud-rain', class: 'weather-rain' },
    85: { label: 'Slight snow showers', icon: 'ph-snowflake', class: 'weather-snow' },
    86: { label: 'Heavy snow showers', icon: 'ph-snowflake', class: 'weather-snow' },
    95: { label: 'Thunderstorm', icon: 'ph-cloud-lightning', class: 'weather-thunderstorm' },
    96: { label: 'Thunderstorm with slight hail', icon: 'ph-cloud-lightning', class: 'weather-thunderstorm' },
    99: { label: 'Thunderstorm with heavy hail', icon: 'ph-cloud-lightning', class: 'weather-thunderstorm' }
};

// DOM Elements Initialization
const searchForm      = document.getElementById('search-form');
const cityInput       = document.getElementById('city-input');
const weatherMain     = document.getElementById('weather-main');
const errorMessage    = document.getElementById('error-message');
const loadingSpinner  = document.getElementById('loading-spinner');
const autocompleteList = document.getElementById('autocomplete-list');

// Current Weather Elements
const elCityName    = document.getElementById('city-name');
const elCurrentDate = document.getElementById('current-date');
const elCurrentIcon = document.getElementById('current-icon');
const elCurrentTemp = document.getElementById('current-temp');
const elWeatherDesc = document.getElementById('weather-description');
const elBadgeLabel  = document.getElementById('badge-label');
const elHumidity    = document.getElementById('humidity');
const elWindSpeed   = document.getElementById('wind-speed');

// Forecast Elements
const forecastContainer = document.getElementById('forecast-container');

// ─────────────────────────────────────────────────────────────
//  INDIAN CITIES DATABASE  { name, state }
// ─────────────────────────────────────────────────────────────
const indianCities = [
    // Andhra Pradesh
    { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Vijayawada',    state: 'Andhra Pradesh' },
    { name: 'Guntur',        state: 'Andhra Pradesh' },
    { name: 'Nellore',       state: 'Andhra Pradesh' },
    { name: 'Kurnool',       state: 'Andhra Pradesh' },
    { name: 'Tirupati',      state: 'Andhra Pradesh' },
    { name: 'Amaravati',     state: 'Andhra Pradesh' },
    // Arunachal Pradesh
    { name: 'Itanagar',      state: 'Arunachal Pradesh' },
    // Assam
    { name: 'Guwahati',      state: 'Assam' },
    { name: 'Silchar',       state: 'Assam' },
    { name: 'Dibrugarh',     state: 'Assam' },
    // Bihar
    { name: 'Patna',         state: 'Bihar' },
    { name: 'Gaya',          state: 'Bihar' },
    { name: 'Muzaffarpur',   state: 'Bihar' },
    { name: 'Bhagalpur',     state: 'Bihar' },
    { name: 'Darbhanga',     state: 'Bihar' },
    { name: 'Purnia',        state: 'Bihar' },
    { name: 'Ara',           state: 'Bihar' },
    { name: 'Begusarai',     state: 'Bihar' },
    { name: 'Bihar Sharif',  state: 'Bihar' },
    { name: 'Sasaram',       state: 'Bihar' },
    // Chhattisgarh
    { name: 'Raipur',        state: 'Chhattisgarh' },
    { name: 'Bhilai',        state: 'Chhattisgarh' },
    { name: 'Bilaspur',      state: 'Chhattisgarh' },
    { name: 'Korba',         state: 'Chhattisgarh' },
    // Goa
    { name: 'Panaji',        state: 'Goa' },
    { name: 'Margao',        state: 'Goa' },
    { name: 'Vasco da Gama', state: 'Goa' },
    // Gujarat
    { name: 'Ahmedabad',     state: 'Gujarat' },
    { name: 'Surat',         state: 'Gujarat' },
    { name: 'Vadodara',      state: 'Gujarat' },
    { name: 'Rajkot',        state: 'Gujarat' },
    { name: 'Bhavnagar',     state: 'Gujarat' },
    { name: 'Jamnagar',      state: 'Gujarat' },
    { name: 'Gandhinagar',   state: 'Gujarat' },
    { name: 'Anand',         state: 'Gujarat' },
    // Haryana
    { name: 'Faridabad',     state: 'Haryana' },
    { name: 'Gurugram',      state: 'Haryana' },
    { name: 'Panipat',       state: 'Haryana' },
    { name: 'Ambala',        state: 'Haryana' },
    { name: 'Hisar',         state: 'Haryana' },
    { name: 'Rohtak',        state: 'Haryana' },
    { name: 'Karnal',        state: 'Haryana' },
    // Himachal Pradesh
    { name: 'Shimla',        state: 'Himachal Pradesh' },
    { name: 'Manali',        state: 'Himachal Pradesh' },
    { name: 'Dharamshala',   state: 'Himachal Pradesh' },
    // Jharkhand
    { name: 'Ranchi',        state: 'Jharkhand' },
    { name: 'Jamshedpur',    state: 'Jharkhand' },
    { name: 'Dhanbad',       state: 'Jharkhand' },
    { name: 'Bokaro',        state: 'Jharkhand' },
    // Karnataka
    { name: 'Bengaluru',     state: 'Karnataka' },
    { name: 'Mysuru',        state: 'Karnataka' },
    { name: 'Hubballi',      state: 'Karnataka' },
    { name: 'Mangaluru',     state: 'Karnataka' },
    { name: 'Belagavi',      state: 'Karnataka' },
    { name: 'Kalaburagi',    state: 'Karnataka' },
    { name: 'Ballari',       state: 'Karnataka' },
    // Kerala
    { name: 'Thiruvananthapuram', state: 'Kerala' },
    { name: 'Kochi',         state: 'Kerala' },
    { name: 'Kozhikode',     state: 'Kerala' },
    { name: 'Thrissur',      state: 'Kerala' },
    { name: 'Kollam',        state: 'Kerala' },
    { name: 'Palakkad',      state: 'Kerala' },
    // Madhya Pradesh
    { name: 'Bhopal',        state: 'Madhya Pradesh' },
    { name: 'Indore',        state: 'Madhya Pradesh' },
    { name: 'Jabalpur',      state: 'Madhya Pradesh' },
    { name: 'Gwalior',       state: 'Madhya Pradesh' },
    { name: 'Ujjain',        state: 'Madhya Pradesh' },
    { name: 'Sagar',         state: 'Madhya Pradesh' },
    // Maharashtra
    { name: 'Mumbai',        state: 'Maharashtra' },
    { name: 'Pune',          state: 'Maharashtra' },
    { name: 'Nagpur',        state: 'Maharashtra' },
    { name: 'Nashik',        state: 'Maharashtra' },
    { name: 'Aurangabad',    state: 'Maharashtra' },
    { name: 'Solapur',       state: 'Maharashtra' },
    { name: 'Amravati',      state: 'Maharashtra' },
    { name: 'Kolhapur',      state: 'Maharashtra' },
    { name: 'Satara',        state: 'Maharashtra' },
    { name: 'Sangli',        state: 'Maharashtra' },
    { name: 'Thane',         state: 'Maharashtra' },
    { name: 'Navi Mumbai',   state: 'Maharashtra' },
    { name: 'Palghar',       state: 'Maharashtra' },
    { name: 'Ratnagiri',     state: 'Maharashtra' },
    { name: 'Akola',         state: 'Maharashtra' },
    { name: 'Latur',         state: 'Maharashtra' },
    { name: 'Dhule',         state: 'Maharashtra' },
    { name: 'Jalgaon',       state: 'Maharashtra' },
    { name: 'Nanded',        state: 'Maharashtra' },
    { name: 'Ahmadnagar',    state: 'Maharashtra' },
    { name: 'Chandrapur',    state: 'Maharashtra' },
    // Manipur
    { name: 'Imphal',        state: 'Manipur' },
    // Meghalaya
    { name: 'Shillong',      state: 'Meghalaya' },
    // Mizoram
    { name: 'Aizawl',        state: 'Mizoram' },
    // Nagaland
    { name: 'Kohima',        state: 'Nagaland' },
    // Odisha
    { name: 'Bhubaneswar',   state: 'Odisha' },
    { name: 'Cuttack',       state: 'Odisha' },
    { name: 'Rourkela',      state: 'Odisha' },
    { name: 'Puri',          state: 'Odisha' },
    { name: 'Berhampur',     state: 'Odisha' },
    // Punjab
    { name: 'Ludhiana',      state: 'Punjab' },
    { name: 'Amritsar',      state: 'Punjab' },
    { name: 'Jalandhar',     state: 'Punjab' },
    { name: 'Patiala',       state: 'Punjab' },
    { name: 'Bathinda',      state: 'Punjab' },
    { name: 'Mohali',        state: 'Punjab' },
    // Rajasthan
    { name: 'Jaipur',        state: 'Rajasthan' },
    { name: 'Jodhpur',       state: 'Rajasthan' },
    { name: 'Udaipur',       state: 'Rajasthan' },
    { name: 'Kota',          state: 'Rajasthan' },
    { name: 'Ajmer',         state: 'Rajasthan' },
    { name: 'Bikaner',       state: 'Rajasthan' },
    { name: 'Alwar',         state: 'Rajasthan' },
    { name: 'Bharatpur',     state: 'Rajasthan' },
    // Sikkim
    { name: 'Gangtok',       state: 'Sikkim' },
    // Tamil Nadu
    { name: 'Chennai',       state: 'Tamil Nadu' },
    { name: 'Coimbatore',    state: 'Tamil Nadu' },
    { name: 'Madurai',       state: 'Tamil Nadu' },
    { name: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { name: 'Salem',         state: 'Tamil Nadu' },
    { name: 'Tirunelveli',   state: 'Tamil Nadu' },
    { name: 'Vellore',       state: 'Tamil Nadu' },
    { name: 'Erode',         state: 'Tamil Nadu' },
    { name: 'Tiruppur',      state: 'Tamil Nadu' },
    { name: 'Ooty',          state: 'Tamil Nadu' },
    // Telangana
    { name: 'Hyderabad',     state: 'Telangana' },
    { name: 'Warangal',      state: 'Telangana' },
    { name: 'Nizamabad',     state: 'Telangana' },
    { name: 'Karimnagar',    state: 'Telangana' },
    // Tripura
    { name: 'Agartala',      state: 'Tripura' },
    // Uttar Pradesh
    { name: 'Lucknow',       state: 'Uttar Pradesh' },
    { name: 'Kanpur',        state: 'Uttar Pradesh' },
    { name: 'Varanasi',      state: 'Uttar Pradesh' },
    { name: 'Agra',          state: 'Uttar Pradesh' },
    { name: 'Meerut',        state: 'Uttar Pradesh' },
    { name: 'Allahabad',     state: 'Uttar Pradesh' },
    { name: 'Prayagraj',     state: 'Uttar Pradesh' },
    { name: 'Ghaziabad',     state: 'Uttar Pradesh' },
    { name: 'Noida',         state: 'Uttar Pradesh' },
    { name: 'Mathura',       state: 'Uttar Pradesh' },
    { name: 'Bareilly',      state: 'Uttar Pradesh' },
    { name: 'Aligarh',       state: 'Uttar Pradesh' },
    { name: 'Moradabad',     state: 'Uttar Pradesh' },
    { name: 'Gorakhpur',     state: 'Uttar Pradesh' },
    { name: 'Firozabad',     state: 'Uttar Pradesh' },
    { name: 'Saharanpur',    state: 'Uttar Pradesh' },
    { name: 'Jhansi',        state: 'Uttar Pradesh' },
    { name: 'Hapur',         state: 'Uttar Pradesh' },
    { name: 'Ayodhya',       state: 'Uttar Pradesh' },
    // Uttarakhand
    { name: 'Dehradun',      state: 'Uttarakhand' },
    { name: 'Haridwar',      state: 'Uttarakhand' },
    { name: 'Rishikesh',     state: 'Uttarakhand' },
    { name: 'Nainital',      state: 'Uttarakhand' },
    { name: 'Roorkee',       state: 'Uttarakhand' },
    // West Bengal
    { name: 'Kolkata',       state: 'West Bengal' },
    { name: 'Asansol',       state: 'West Bengal' },
    { name: 'Siliguri',      state: 'West Bengal' },
    { name: 'Durgapur',      state: 'West Bengal' },
    { name: 'Darjeeling',    state: 'West Bengal' },
    { name: 'Howrah',        state: 'West Bengal' },
    // Union Territories
    { name: 'New Delhi',     state: 'Delhi' },
    { name: 'Delhi',         state: 'Delhi' },
    { name: 'Chandigarh',    state: 'UT' },
    { name: 'Puducherry',    state: 'UT' },
    { name: 'Port Blair',    state: 'Andaman & Nicobar' },
    { name: 'Silvassa',      state: 'Dadra & NH' },
    { name: 'Daman',         state: 'Daman & Diu' },
    { name: 'Kavaratti',     state: 'Lakshadweep' },
    { name: 'Leh',           state: 'Ladakh' },
    { name: 'Srinagar',      state: 'J&K' },
    { name: 'Jammu',         state: 'J&K' },
];

// ─────────────────────────────────────────────────────────────
//  AUTOCOMPLETE LOGIC
// ─────────────────────────────────────────────────────────────
let activeIndex = -1; // keyboard nav index

cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim().toLowerCase();
    activeIndex = -1;

    if (query.length < 1) {
        hideAutocomplete();
        return;
    }

    const matches = indianCities
        .filter(c => c.name.toLowerCase().startsWith(query))
        .slice(0, 8); // max 8 suggestions

    if (matches.length === 0) {
        hideAutocomplete();
        return;
    }

    autocompleteList.innerHTML = '';
    matches.forEach((city, i) => {
        const li = document.createElement('li');
        li.dataset.index = i;
        li.innerHTML = `
            <span class="city-flag">🇮🇳</span>
            <span>${city.name}</span>
            <span class="city-state">${city.state}</span>
        `;
        li.addEventListener('mousedown', (e) => {
            e.preventDefault(); // prevent blur before click
            selectCity(city.name);
        });
        autocompleteList.appendChild(li);
    });

    autocompleteList.classList.remove('hidden');
});

// Keyboard navigation (↑ ↓ Enter Escape)
cityInput.addEventListener('keydown', (e) => {
    const items = autocompleteList.querySelectorAll('li');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, -1);
        updateActiveItem(items);
    } else if (e.key === 'Escape') {
        hideAutocomplete();
    }
});

function updateActiveItem(items) {
    items.forEach((item, i) => item.classList.toggle('active', i === activeIndex));
    if (activeIndex >= 0) cityInput.value = items[activeIndex].querySelector('span:nth-child(2)').textContent;
}

function selectCity(name) {
    cityInput.value = name;
    hideAutocomplete();
    getWeatherData(name);
}

function hideAutocomplete() {
    autocompleteList.classList.add('hidden');
    autocompleteList.innerHTML = '';
    activeIndex = -1;
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) hideAutocomplete();
});

// Event Listeners
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        // Unfocus the input keyboard on mobile
        cityInput.blur();
        await getWeatherData(city);
    }
});

/**
 * Formats an ISO date string to a readable format like "Mon, 21 Apr"
 */
function formatDate(dateStr) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

/**
 * Main function to fetch coordinates and then weather data
 */
async function getWeatherData(city) {
    showLoading();
    
    try {
        // 1. Open-Meteo Geocoding API to convert city name to coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        
        if (!geoRes.ok) throw new Error('Network response was not ok');
        
        const geoData = await geoRes.json();
        
        // Check if city was actually found
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please check spelling.');
        }
        
        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        
        // Construct a nice city name string (e.g. "Paris, France" or just "London" depending on data)
        const countryText = location.country ? `, ${location.country}` : '';
        const cityName = `${location.name}${countryText}`;
        
        // 2. Open-Meteo Weather API to get current and forecast data
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`);
        
        if (!weatherRes.ok) throw new Error('Failed to fetch weather data');
        
        const weatherData = await weatherRes.json();
        
        // Update the User Interface
        updateUI(cityName, weatherData);
        
    } catch (error) {
        console.error("Weather App Error: ", error);
        showError(error.message);
    }
}

/**
 * Updates the DOM with fetched data
 */
function updateUI(cityName, data) {
    hideLoading();
    weatherMain.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    // --- Update Current Weather ---
    const current = data.current;
    // Map the WMO code to our custom UI mapping. Fallback to clear sky (0) if unknown.
    const weatherInfo = weatherCodeMap[current.weather_code] || weatherCodeMap[0];
    
    elCityName.textContent      = cityName;
    elCurrentDate.textContent   = formatDate(current.time);
    elCurrentTemp.textContent   = `${Math.round(current.temperature_2m)}°C`;
    elWeatherDesc.textContent   = weatherInfo.label;
    elBadgeLabel.textContent    = weatherInfo.label;  // always-visible badge
    elHumidity.textContent      = `${current.relative_humidity_2m}%`;
    elWindSpeed.textContent     = `${current.wind_speed_10m} km/h`;
    
    // Update Main Icon
    elCurrentIcon.className = `ph ${weatherInfo.icon} main-icon`;

    // Detect day vs night using today's sunrise/sunset for this city
    const todaySunrise = new Date(data.daily.sunrise[0]);
    const todaySunset  = new Date(data.daily.sunset[0]);
    const currentTime  = new Date(data.current.time);
    const night = currentTime < todaySunrise || currentTime > todaySunset;

    // Update Dynamic Background Theme (weather class + optional night modifier)
    document.body.className = weatherInfo.class + (night ? ' is-night' : ' is-day');
    
    // --- Update 5-Day Forecast ---
    forecastContainer.innerHTML = '';
    const daily = data.daily;
    
    // We start from index 1 to skip today's forecast and show the next 5 days
    for(let i = 1; i < 6; i++) {
        // Safety check if data array is shorter than expected
        if (!daily.time[i]) break;
        
        const code = daily.weather_code[i];
        const info = weatherCodeMap[code] || weatherCodeMap[0];
        const tempMax = Math.round(daily.temperature_2m_max[i]);
        const tempMin = Math.round(daily.temperature_2m_min[i]);
        
        // Create the forecast card
        const card = document.createElement('div');
        card.className = 'forecast-card glass-panel';
        
        // We only want the short day name for the forecast (e.g. "Tue")
        const shortDay = formatDate(daily.time[i]).split(',')[0];
        
        card.innerHTML = `
            <div class="forecast-day">${shortDay}</div>
            <i class="ph ${info.icon} forecast-icon"></i>
            <div class="forecast-temp-max">${tempMax}°</div>
            <div class="forecast-temp-min">${tempMin}°</div>
        `;
        
        forecastContainer.appendChild(card);
    }
}

// UI Utility Functions
function showLoading() {
    weatherMain.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showError(msg) {
    loadingSpinner.classList.add('hidden');
    weatherMain.classList.add('hidden');
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

// Initialize application with a default city on page load
// Set to user's local timezone auto (London used as default placeholder)
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData('London');
});
