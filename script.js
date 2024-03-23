const units = document.querySelectorAll('.unit');

var active_unit = 0;
units.forEach(function(div) {
    div.addEventListener('click', function() {
        units.forEach(function(item) {
            item.classList.remove("active");
        });
        this.classList.add("active");

        for(let j = 0; j < 2; j++){
            if(units[j].classList.contains("active")){
                active_unit = j;
                break;
            }
        }
    });
});

const daily_divs = document.querySelectorAll('.daily-forecast div .box');

daily_divs.forEach(function(div) {
    div.addEventListener('click', function() {
        daily_divs.forEach(function(item) {
            item.classList.remove("active");
        });
        this.classList.add("active");
    });
});

const api_key_1 = "5e1739c9d76bba8b9f80dc9d165acf75";

const form = document.querySelector("#city_form");

form.addEventListener("submit", function(event){
    event.preventDefault();
    const search_bar = document.querySelector("#search_bar");
    const city = search_bar.value;
    search_bar.value = ""

    const geo_api_url = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+api_key_1;

    fetch(geo_api_url)
        .then(response => {
            return response.json();
        })
        .then(city_data => {
            const lat = city_data[0].lat;
            const lon = city_data[0].lon;
            const city = city_data[0].name;
            const weather_api_url_celsius = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto";
            const weather_api_url_farenheit = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto";
            const urls = [weather_api_url_celsius, weather_api_url_farenheit];
            fetch(urls[active_unit])
                .then(response => {
                    return response.json();
                })
                .then(w_data => {
                    // SUMMARY
                    // RELEVANT
                    const temp = document.querySelector(".summary .relevant-data .temp h1");
                    const f_like = document.querySelector(".summary .relevant-data .temp div");
                    temp.textContent = Math.round(w_data.current.temperature_2m) + w_data.current_units.temperature_2m;
                    f_like.textContent = "Feels like " + w_data.current.apparent_temperature + w_data.current_units.apparent_temperature;
                    // LOCATION
                    const location = document.querySelector(".summary .non-weather-data .location");
                    const date = document.querySelector(".summary .non-weather-data .date");
                    location.textContent = city;
                    const months = ["jan.", "feb.", "mar.", "apr.", "may.", "jun.", "jul.", "aug.", "sep.", "oct.", "nov.", "dec."];
                    date.textContent = w_data.current.time.substring(8,10) + " " + months[parseInt(w_data.current.time.substring(5,7))-1] + " " + w_data.current.time.substring(0,4) + " - " + w_data.current.time.substring(11,16);
                    // EXTRA DATA
                    const rain = document.querySelector(".summary .extra-data .rain .data div");
                    const wind = document.querySelector(".summary .extra-data .wind .data div");
                    const humidity = document.querySelector(".summary .extra-data .humidity .data div");

                    rain.textContent = w_data.current.precipitation + " " + w_data.current_units.precipitation;
                    wind.textContent = w_data.current.wind_speed_10m + " " + w_data.current_units.wind_speed_10m;
                    humidity.textContent = w_data.current.relative_humidity_2m + w_data.current_units.relative_humidity_2m;

                    // DAILY  
                    const nums = ["one", "two", "three", "four", "five", "six", "seven"]
                    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const wmo_code = {
                        0: "Clear Sky",
                        1: "Mainly Clear",
                        2: "Partialy Cloudy",
                        3: "Cloudy",
                        45: "Fog",
                        48: "Fog",
                        51: "Light Drizzle",
                        53: "Moderate Drizzle",
                        55: "Dense Drizzle",
                        56: "Light Freezing Drizzle",
                        57: "Dense Freezing Drizzle",
                        61: "Slight Rain",
                        63: "Moderate Rain",
                        65: "Heavy Rain",
                        66: "Light Freezing Rain",
                        67: "Heavy Freezing Rain",
                        71: "Slight Snow Fall",
                        73: "Moderate Snow Fall",
                        75: "Heavy Snow Fall",
                        77: "Snow Grains",
                        80: "Slight Rain Showers",
                        81: "Moderate Rain Showers",
                        82: "Violent Rain Showers",
                        85: "Slight Snow Showers",
                        86: "Heavy Snow Showers",
                        95: "Thunderstorm",
                        96: "Thunderstorm with Slight Hail",
                        99: "Thunderstorm with Moderate Hail",
                    }
                    
                    for (let i = 1; i <= 7; i++) {
                        const dayElement = document.querySelector(`.daily-forecast .box#day-${nums[i-1]} .day h3`);
                        const weatherElement = document.querySelector(`.daily-forecast .box#day-${nums[i-1]} .weather h4`);
                        const maxMinElement = document.querySelector(`.daily-forecast .box#day-${nums[i-1]} .max-min h4`);
                    
                        dayElement.textContent = weekdays[new Date(w_data.daily.time[i - 1]).getDay()];
                        weatherElement.textContent = wmo_code[w_data.daily.weather_code[i - 1]];
                        maxMinElement.textContent = parseInt(w_data.daily.temperature_2m_max[i - 1]) + w_data.daily_units.temperature_2m_max + "/" + parseInt(w_data.daily.temperature_2m_min[i - 1]) + w_data.daily_units.temperature_2m_min;
                    }

                    // HOURLY
                    const days = document.querySelectorAll(".daily-forecast .box");
                    var active_day = 0;
                    for(let j = 0; j < 7; j++){
                        if(days[j].classList.contains("active")){
                            active_day = j;
                            break;
                        }
                    }
                    for(let i = 0; i < 12; i++){
                        const hourly_temp = document.querySelector(`.today #hour-${i*2}-00 .temp`);
                        hourly_temp.textContent = w_data.hourly.temperature_2m[active_day*24 + i*2] + w_data.hourly_units.temperature_2m;
                    }

                    daily_divs.forEach(function(div) {
                        div.addEventListener('click', function() {
                            daily_divs.forEach(function(item) {
                                item.classList.remove("active");
                            });
                            this.classList.add("active");
                    
                            // HOURLY
                            const days = document.querySelectorAll(".daily-forecast .box");
                            var active_day = 0;
                            for(let j = 0; j < 7; j++){
                                if(days[j].classList.contains("active")){
                                    active_day = j;
                                    break;
                                }
                            }
                            for(let i = 0; i < 12; i++){
                                const hourly_temp = document.querySelector(`.today #hour-${i*2}-00 .temp`);
                                hourly_temp.textContent = w_data.hourly.temperature_2m[active_day*24 + i*2] + w_data.hourly_units.temperature_2m;
                            }
                        });
                    });
                })
        })
});