let notificationElement = document.querySelector(".notification");
let iconElement = document.querySelector(".weather-icon");
let tempElement = document.querySelector(".temp-value p");
let descElement = document.querySelector(".temp-description p");
let locationElement = document.querySelector(".location p");

//for windmille we need a couple more elements:
let windmillText = document.getElementById("windmillTitle");
let rotatingFlaps = document.querySelector(".flaps");

//for eventlistener of submit button on landing page
let submit = document.getElementById("submit");

const weather = {};
weather.temperature = {
  unit: "celsius",
};

const KELVIN = 273;
const key = "92e62b34141b6fe50fe8e3935ae2e018";

//let city = "espoo"; /* prompt("Enter city name") */
/* function city() {
  let cityN = document.getElementById("cityName").value;
  console.log(cityN);
}
city(); */
/* function getCity() {
  let city = document.getElementById(cityName).value;
  return city;
}
let cityN = getCity();
console.log(cityN); */

function getCity() 
  let city = document.getElementById("cityName").value;
  return city;

console.log(getCity());
/*** fetching dataing using openweather api */
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}`;
fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
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

/**EVENTLISTENER get city name */

submit.addEventListener("click", getCity);

/**second api call */
let lat = 60.25;
let lon = 24.6667;
/* let cnt = 10; */
/* let key1 = "15e011982aa379793f2783ceb2b8952c"; */
let dailyForcast = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

/* `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${cnt}&APPID=${key}`; */
fetch(dailyForcast)
  .then((resp) => resp.json())
  .then((forcast) => {
    console.log(forcast);

    let epocToDate = forcast.list[24].dt;
    console.log("data:", epocToDate);
    let myDate = new Date(epocToDate * 1000);
    let convert = myDate.toLocaleString();
    console.log("readable date:", convert);
  });
