let notificationElement = document.querySelector(".notification");
let iconElement = document.querySelector(".weather-icon");
let tempElement = document.querySelector(".temp-value p");
let descElement = document.querySelector(".temp-description p");
let locationElement = document.querySelector(".location p");

// Variable for pollution value
let pollution = 0;

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
  })
  .then(function () {
    displayWeather();
  });

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
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

/** Air pollution */

let pollutionValues = document.getElementsByClassName("pollutionValues");
let triangles = document.getElementsByClassName("triangle-down");
let pollutionDescriptions = document.getElementsByClassName("descriptions");

// pollution = 1;

for (i = 0; i <pollutionValues.length; i++) {
  pollutionValues[i].style.visibility = "hidden";
  triangles[i].style.visibility = "hidden";
  pollutionDescriptions[i].style.visibility = "hidden";
}

if (pollution === 5) {
  pollutionValues[0].style.visibility = "visible";
  triangles[0].style.visibility = "visible";
  pollutionDescriptions[0].style.visibility = "visible";
} else if (pollution === 4) {
  pollutionValues[1].style.visibility = "visible";
  triangles[1].style.visibility = "visible";
  pollutionDescriptions[1].style.visibility = "visible";
} else if (pollution === 3) {
  pollutionValues[2].style.visibility = "visible";
  triangles[2].style.visibility = "visible";
  pollutionDescriptions[2].style.visibility = "visible";
} else if (pollution === 2) {
  pollutionValues[3].style.visibility = "visible";
  triangles[3].style.visibility = "visible";
  pollutionDescriptions[3].style.visibility = "visible";
} else if (pollution === 1) {
  pollutionValues[4].style.visibility = "visible";
  triangles[4].style.visibility = "visible";
  pollutionDescriptions[4].style.visibility = "visible";
}



