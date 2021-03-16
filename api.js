let notificationElement = document.querySelector(".notification");
let iconElement = document.querySelector(".weather-icon");
let tempElement = document.querySelector(".temp-value p");
let descElement = document.querySelector(".temp-description p");
let locationElement = document.querySelector(".location p");

//for windmille we need a couple more elements:
let windmillText = document.getElementById("windmillTitle");
let rotatingFlaps = document.querySelector(".flaps");

const weather = {};
weather.temperature = {
  unit: "celsius",
};

const KELVIN = 273;
const key = "92e62b34141b6fe50fe8e3935ae2e018";
let city = prompt("Enter city name");

/*** fetching dataing using openweather api */
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}`;
fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    weather.temperature.value = Math.floor(data.main.temp - KELVIN);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;

    weather.city = data.name;
    weather.country = data.sys.country;

    //let's get windspeed also:
    weather.windspeed = data.wind.speed;
  })
  .then(function () {
    displayWeather();
    displayWind();
  });

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}
function displayWind() {
  if (weather.windspeed < 2) {
    windmillText.innerHTML = `Wind is calm (${weather.windspeed})`;
    rotatingFlaps.classList.add("speed1");
    console.log("speed1");
  } else if (weather.windspeed.value < 3) {
    windmillText.innerHTML = `Windspeed: Calm (${weather.windspeed})`;
    console.log("speed2");
    rotatingFlaps.classList.add("speed2");
  } else if (weather.windspeed < 5) {
    windmillText.innerHTML = `Windspeed: Moderate (${weather.windspeed})`;
    console.log("speed4");
    rotatingFlaps.classList.add("speed3");
  } else if (weather.windspeed < 8) {
    windmillText.innerHTML = `Windspeed: Strong winds (${weather.windspeed})`;
    console.log("speed4");
    rotatingFlaps.classList.add("speed4");
  } else {
    windmillText.innerHTML = `Windspeed: Gale (${weather.windspeed})`;
    rotatingFlaps.classList.add("speed5");
    console.log("speed5, fastest");
  }
}

/** conversion of temperature */
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

/** when user clicking on display of tempElement for changing display temp fron c to f or f to c */
tempElement.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);
    tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
