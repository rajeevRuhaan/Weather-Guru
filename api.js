let notificationElement = document.querySelector(".notification");
let iconElement = document.querySelector(".weather-icon");
let tempElement = document.querySelector(".temp-value p");
let descElement = document.querySelector(".temp-description p");
let locationElement = document.querySelector(".location p");

//for windmille we need a couple more elements:
let windmillText = document.getElementById("windmillTitle");
let rotatingFlaps = document.querySelector(".flaps");

//for eventlistener of submit button on landing page
//let submit = document.getElementById("submit");

const weather = {};
weather.temperature = {
  unit: "celsius",
};
let pollution = 0;
const KELVIN = 273;
const key = "92e62b34141b6fe50fe8e3935ae2e018";

let city = prompt("Enter city name");
//var submit = document.getElementById("submit");

/* function getCity() {
  event.preventDefault();
  let city = document.getElementById("cityName").value;
  console.log(city);
} */
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
    let latitude = data.coord.lat;
    let longitude = data.coord.lon;
    getLatLon(latitude, longitude);
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

//submit.addEventListener("click", getCity);

/**second api call */
let pollutionValues = document.getElementsByClassName("pollutionValues");
let triangles = document.getElementsByClassName("triangle-down");
let pollutionDescriptions = document.getElementsByClassName("descriptions");
let coLevel = document.getElementById("coLevel");

function getLatLon(la, lo) {
  console.log(la, lo);

  //let lat = 28.6667; //60.25;
  //let lon = 77.2167; //24.6667;
  /* let cnt = 10; */
  /* let key1 = "15e011982aa379793f2783ceb2b8952c"; */
  let dailyForcast = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${la}&lon=${lo}&appid=${key}`;

  /* `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${cnt}&APPID=${key}`; */
  fetch(dailyForcast)
    .then((resp) => resp.json())
    .then((forcast) => {
      console.log(forcast);
      let pollution = forcast.list[0].components.co;
      console.log(pollution);
      let epocToDate = forcast.list[24].dt;
      console.log("data:", epocToDate);
      let myDate = new Date(epocToDate * 1000);
      let convert = myDate.toLocaleString();
      console.log("readable date:", convert);
      coLevel.textContent = `${pollution} (µg/m3)`;
      /* Display air index */

      for (i = 0; i < pollutionValues.length; i++) {
        pollutionValues[i].style.visibility = "hidden";
        triangles[i].style.visibility = "hidden";
        pollutionDescriptions[i].style.visibility = "hidden";
      }

      if (pollution > 30000) {
        pollutionValues[0].style.visibility = "visible";
        triangles[0].style.visibility = "visible";
        pollutionDescriptions[0].style.visibility = "visible";
      } else if (pollution > 20000) {
        pollutionValues[1].style.visibility = "visible";
        triangles[1].style.visibility = "visible";
        pollutionDescriptions[1].style.visibility = "visible";
      } else if (pollution > 8000) {
        pollutionValues[2].style.visibility = "visible";
        triangles[2].style.visibility = "visible";
        pollutionDescriptions[2].style.visibility = "visible";
      } else if (pollution > 4000) {
        pollutionValues[3].style.visibility = "visible";
        triangles[3].style.visibility = "visible";
        pollutionDescriptions[3].style.visibility = "visible";
      } else if (pollution > 0) {
        pollutionValues[4].style.visibility = "visible";
        triangles[4].style.visibility = "visible";
        pollutionDescriptions[4].style.visibility = "visible";
      }
    });
}
/** Air pollution */

//pollution = 3;
