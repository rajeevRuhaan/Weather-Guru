let notificationElement = document.querySelector(".notification");
let iconElement = document.querySelector(".weather-icon");
let tempElement = document.querySelector(".temp-value p");
let descElement = document.querySelector(".temp-description p");
let locationElement = document.querySelector(".location p");
let dataSection = document.getElementById("data-area");

//for second API call for AQI
let pollutionValues = document.getElementsByClassName("pollutionValues");
let triangles = document.getElementsByClassName("triangle-down");
let pollutionDescriptions = document.getElementsByClassName("descriptions");
let coLevel = document.getElementById("coLevel");

//instead of displaying "Weather"-text, let's display greeting:
let greetingText = document.getElementById("greeting-text");

//for windmill we need a couple more elements:
let windmillText = document.getElementById("windmillTitle");
let rotatingFlaps = document.querySelector(".flaps");

//for eventlistener of submit button
let submit = document.getElementById("submit");
let city = "Helsinki";

const weather = {};
weather.temperature = {
  unit: "celsius",
};

let pollution = 0;
const KELVIN = 273;
const key = "92e62b34141b6fe50fe8e3935ae2e018";

/**EVENTLISTENER get city name */

submit.addEventListener("click", getCity);

function getCity() {
  console.log("getcity started. City: " + city);
  city = document.getElementById("cityName").value;
  console.log("Now it's " + city);

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

      //lets get latitude and longitude from first API call
      let latitude = data.coord.lat;
      let longitude = data.coord.lon;
      getLatLon(latitude, longitude);

      //Getting wind data:
      weather.windspeed = data.wind.speed;
      weather.windDirection = data.wind.deg;
    })
    .then(function () {
      displayWeather();
      displayWind();
      //let's get the greeting also:
      displayGreeting();

      displayWindDirection();

      showData();
    });
}

/*****second api call ******/

function getLatLon(la, lo) {
  console.log(la, lo);

  /* let key1 = "15e011982aa379793f2783ceb2b8952c"; */
  let dailyForcast = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${la}&lon=${lo}&appid=${key}`;

  fetch(dailyForcast)
    .then((resp) => resp.json())

    .then((airPollution) => {
      console.log(airPollution);
      //get AQI index from api
      weather.pollution = airPollution.list[0].main.aqi;
    })
    .then(function () {
      displayAQI();
    });
}

function displayAQI() {
  console.log(weather.pollution);
  for (i = 0; i < pollutionValues.length; i++) {
    pollutionValues[i].style.visibility = "hidden";
    triangles[i].style.visibility = "hidden";
    pollutionDescriptions[i].style.visibility = "hidden";
  }

  if (weather.pollution === 5) {
    pollutionValues[0].style.visibility = "visible";
    triangles[0].style.visibility = "visible";
    pollutionDescriptions[0].style.visibility = "visible";
  } else if (weather.pollution === 4) {
    pollutionValues[1].style.visibility = "visible";
    triangles[1].style.visibility = "visible";
    pollutionDescriptions[1].style.visibility = "visible";
  } else if (weather.pollution === 3) {
    pollutionValues[2].style.visibility = "visible";
    triangles[2].style.visibility = "visible";
    pollutionDescriptions[2].style.visibility = "visible";
  } else if (weather.pollution === 2) {
    pollutionValues[3].style.visibility = "visible";
    triangles[3].style.visibility = "visible";
    pollutionDescriptions[3].style.visibility = "visible";
  } else {
    pollutionValues[4].style.visibility = "visible";
    triangles[4].style.visibility = "visible";
    pollutionDescriptions[4].style.visibility = "visible";
  }
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function displayWind() {
  if (weather.windspeed < 2) {
    windmillText.innerHTML = `Wind speed: Calm (${weather.windspeed} m/s)`;
    rotatingFlaps.classList.add("speed1");
    console.log("speed1");
  } else if (weather.windspeed.value < 3) {
    windmillText.innerHTML = `Wind speed: Light breeze (${weather.windspeed} m/s)`;
    console.log("speed2");
    rotatingFlaps.classList.add("speed2");
  } else if (weather.windspeed < 5) {
    windmillText.innerHTML = `Wind speed: Moderate (${weather.windspeed} m/s)`;
    console.log("speed4");
    rotatingFlaps.classList.add("speed3");
  } else if (weather.windspeed < 8) {
    windmillText.innerHTML = `Wind speed: Strong winds (${weather.windspeed} m/s)`;
    console.log("speed4");
    rotatingFlaps.classList.add("speed4");
  } else {
    windmillText.innerHTML = `Wind speed: Gale (${weather.windspeed})`;
    rotatingFlaps.classList.add("speed5");
    console.log("speed5, fastest");
  }
}
function showData() {
  dataSection.style.display = "block";
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

function displayGreeting() {
  //Getting the greeting data from https://github.com/stathisg/hello-in-all-languages:

  let text = `("A1", "Anonymous Proxy", "Hello"),
  ("A2", "Satellite Provider", "Hello"),
  ("AD", "Andorra", "Hola"),
  ("AE", "United Arab Emirates", "Marhaba"),
  ("AF", "Afghanistan", "Senga yai"),
  ("AG", "Antigua and Barbuda", "Hello"),
  ("AI", "Anguilla", "Hello"),
  ("AL", "Albania", "Tungjatjeta"),
  ("AM", "Armenia", "Barev"),
  ("AN", "Netherlands Antilles", "Kon ta bai"),
  ("AO", "Angola", "Olá"),
  ("AP", "Asia/Pacific Region", "Hello"),
  ("AQ", "Antarctica", "Hello"),
  ("AR", "Argentina", "Hola"),
  ("AS", "American Samoa", "Hello"),
  ("AT", "Austria", "Hallo"),
  ("AU", "Australia", "Hello"),
  ("AW", "Aruba", "Kon ta bai"),
  ("AX", "Aland Islands", "Hello"),
  ("AZ", "Azerbaijan", "Salam"),
  ("BA", "Bosnia and Herzegovina", "Zdravo"),
  ("BB", "Barbados", "Hello"),
  ("BD", "Bangladesh", "Namaskar"),
  ("BE", "Belgium", "Hallo"),
  ("BF", "Burkina Faso", "Bonjour"),
  ("BG", "Bulgaria", "Zdravei"),
  ("BH", "Bahrain", "Marhaba"),
  ("BI", "Burundi", "Bonjour"),
  ("BJ", "Benin", "Bonjour"),
  ("BM", "Bermuda", "Hello"),
  ("BN", "Brunei Darussalam", "Selamat"),
  ("BO", "Bolivia", "Hola"),
  ("BR", "Brazil", "Olá"),
  ("BS", "Bahamas", "Hello"),
  ("BT", "Bhutan", "Kuzu zangpo"),
  ("BV", "Bouvet Island", "Hello"),
  ("BW", "Botswana", "Dumela"),
  ("BY", "Belarus", "Вітаю"),
  ("BZ", "Belize", "Hello"),
  ("CA", "Canada", "Hello"),
  ("CD", "Congo", "Bonjour"),
  ("CF", "Central African Republic", "Bonjour"),
  ("CG", "Congo", "Bonjour"),
  ("CH", "Switzerland", "Hallo"),
  ("CI", "Cote d'Ivoire", "Bonjour"),
  ("CK", "Cook Islands", "Kia orana"),
  ("CL", "Chile", "Hola"),
  ("CM", "Cameroon", "Hello"),
  ("CN", "China", "你好"),
  ("CO", "Colombia", "Hola"),
  ("CR", "Costa Rica", "Hola"),
  ("CU", "Cuba", "Hola"),
  ("CV", "Cape Verde", "Olá"),
  ("CY", "Cyprus", "γεια σας"),
  ("CZ", "Czech Republic", "Dobrý den"),
  ("DE", "Germany", "Hallo"),
  ("DJ", "Djibouti", "Marhaba"),
  ("DK", "Denmark", "Hej"),
  ("DM", "Dominica", "Hello"),
  ("DO", "Dominican Republic", "Hola"),
  ("DZ", "Algeria", "Marhaba"),
  ("EC", "Ecuador", "Hola"),
  ("EE", "Estonia", "Tervist"),
  ("EG", "Egypt", "Marhaba"),
  ("ER", "Eritrea", "Marhaba"),
  ("ES", "Spain", "Hola"),
  ("ET", "Ethiopia", "Teanastëllën"),
  ("EU", "Europe", "Hello"),
  ("FI", "Finland", "Moi"),
  ("FJ", "Fiji", "Hello"),
  ("FK", "Falkland Islands (Malvinas)", "Hello"),
  ("FM", "Micronesia  Federated States of", "Hello"),
  ("FO", "Faroe Islands", "Hallo"),
  ("FR", "France", "Bonjour"),
  ("GA", "Gabon", "Bonjour"),
  ("GB", "Great Britain", "Hello"),
  ("GD", "Grenada", "Hello"),
  ("GE", "Georgia", "Gamardjobat"),
  ("GF", "French Guiana", "Bonjour"),
  ("GG", "Guernsey", "Hello"),
  ("GH", "Ghana", "Hello"),
  ("GI", "Gibraltar", "Hello"),
  ("GL", "Greenland", "Aluu"),
  ("GM", "Gambia", "Hello"),
  ("GN", "Guinea", "Bonjour"),
  ("GP", "Guadeloupe", "Hello"),
  ("GQ", "Equatorial Guinea", "Hola"),
  ("GR", "Greece", "γεια σας"),
  ("GT", "Guatemala", "Hola"),
  ("GU", "Guam", "Hello"),
  ("GW", "Guinea-Bissau", "Olá"),
  ("GY", "Guyana", "Hello"),
  ("HK", "Hong Kong", "你好"),
  ("HN", "Honduras", "HHola"),
  ("HR", "Croatia", "Bok"),
  ("HT", "Haiti", "Bonjour"),
  ("HU", "Hungary", "Jó napot"),
  ("ID", "Indonesia", "Selamat"),
  ("IE", "Ireland", "Haileo"),
  ("IL", "Israel", "Shalom"),
  ("IM", "Isle_of_Man", "Hello"),
  ("IN", "India", "नमस्ते"),
  ("IO", "British Indian Ocean Territory", "Hello"),
  ("IQ", "Iraq", "Marhaba"),
  ("IR", "Iran  Islamic Republic of", "Salâm"),
  ("IS", "Iceland", "Góðan daginn"),
  ("IT", "Italy", "Buon giorno"),
  ("JE", "Jersey", "Hello"),
  ("JM", "Jamaica", "Hello"),
  ("JO", "Jordan", "Marhaba"),
  ("JP", "Japan", "こんにちは"),
  ("KE", "Kenya", "Habari"),
  ("KG", "Kyrgyzstan", "Kandisiz"),
  ("KH", "Cambodia", "Sua sdei"),
  ("KI", "Kiribati", "Mauri"),
  ("KM", "Comoros", "Bariza djioni"),
  ("KN", "Saint Kitts and Nevis", "Hello"),
  ("KW", "Kuwait", "Marhaba"),
  ("KY", "Cayman Islands", "Hello"),
  ("KZ", "Kazakhstan", "Salam"),
  ("LB", "Lebanon", "Marhaba"),
  ("LC", "Saint Lucia", "Hello"),
  ("LI", "Liechtenstein", "Hallo"),
  ("LK", "Sri_Lanka", "A yubowan"),
  ("LR", "Liberia", "Hello"),
  ("LS", "Lesotho", "Hello"),
  ("LT", "Lithuania", "Laba diena"),
  ("LU", "Luxembourg", "Moïen"),
  ("LV", "Latvia", "Sveiki"),
  ("LY", "Libyan Arab Jamahiriya", "Marhaba"),
  ("MA", "Morocco", "Marhaba"),
  ("MC", "Monaco", "Bonjour"),
  ("MD", "Moldova  Republic of", "Salut"),
  ("ME", "Montenegro", "Zdravo"),
  ("MG", "Madagascar", "Manao ahoana"),
  ("MH", "Marshall Islands", "Yokwe"),
  ("MK", "Macedonia", "Здраво"),
  ("ML", "Mali", "Bonjour"),
  ("MM", "Myanmar", "Mingalarba"),
  ("MN", "Mongolia", "Sain baina uu"),
  ("MO", "Macao", "&#20320&#22909"),
  ("MP", "Northern_Mariana_Islands", "Hello"),
  ("MQ", "Martinique", "Hello"),
  ("MR", "Mauritania", "Marhaba"),
  ("MS", "Montserrat", "Hello"),
  ("MT", "Malta", "Bongu"),
  ("MU", "Mauritius", "Hello"),
  ("MV", "Maldives", "Kihineth"),
  ("MW", "Malawi", "Muribwanji"),
  ("MX", "Mexico", "Hola"),
  ("MY", "Malaysia", "Selamat"),
  ("MZ", "Mozambique", "Olá"),
  ("NA", "Namibia", "Hello"),
  ("NC", "New Caledonia", "Bozo"),
  ("NE", "Niger", "Bonjour"),
  ("NF", "Norfolk Island", "Whataway"),
  ("NG", "Nigeria", "Hello"),
  ("NI", "Nicaragua", "Hola"),
  ("NL", "Netherlands", "Hallo"),
  ("NO", "Norway", "Hallo"),
  ("NP", "Nepal", "Namaste"),
  ("NR", "Nauru", "Hello"),
  ("NU", "Niue", "Faka lofa lahi atu"),
  ("NZ", "New Zealand", "Hello"),
  ("OM", "Oman", "Marhaba"),
  ("PA", "Panama", "Hola"),
  ("PE", "Peru", "Hola"),
  ("PF", "French Polynesia", "Bonjour"),
  ("PG", "Papua New Guinea", "Hello"),
  ("PH", "Philippines", "Halo"),
  ("PK", "Pakistan", "Adaab"),
  ("PL", "Poland", "Dzień dobry"),
  ("PM", "Saint Pierre and Miquelon", "Hello"),
  ("PR", "Puerto Rico", "Hola"),
  ("PS", "Palestinian Territory", "Marhaba"),
  ("PT", "Portugal", "Olá"),
  ("PW", "Palau", "Alii"),
  ("PY", "Paraguay", "Hola"),
  ("QA", "Qatar", "Marhaba"),
  ("RE", "Reunion", "Hello"),
  ("RO", "Romania", "Salut"),
  ("RS", "Serbia", "Zdravo"),
  ("RU", "Russian Federation", "Привет"),
  ("RW", "Rwanda", "Hello"),
  ("SA", "Saudi Arabia", "Marhaba"),
  ("SB", "Solomon Islands", "Hello"),
  ("SC", "Seychelles", "Hello"),
  ("SD", "Sudan", "Marhaba"),
  ("SE", "Sweden", "God dag"),
  ("SG", "Singapore", "Selamat"),
  ("SI", "Slovenia", "Živijo"),
  ("SK", "Slovakia", "Dobrý deň"),
  ("SL", "Sierra Leone", "Hello"),
  ("SM", "San Marino", "Buon giorno"),
  ("SN", "Senegal", "Bonjour"),
  ("SO", "Somalia", "Maalim wanaqsan"),
  ("SR", "Suriname", "Hallo"),
  ("ST", "Sao Tome and Principe", "Hello"),
  ("SV", "El Salvador", "Hola"),
  ("SY", "Syrian Arab Republic", "Marhaba"),
  ("SZ", "Swaziland", "Hello"),
  ("TC", "Turks and Caicos Islands", "Hello"),
  ("TD", "Chad", "Marhaba"),
  ("TG", "Togo", "Bonjour"),
  ("TH", "Thailand", "Sawatdi"),
  ("TJ", "Tajikistan", "Salom"),
  ("TK", "Tokelau", "Taloha"),
  ("TM", "Turkmenistan", "Salam"),
  ("TN", "Tunisia", "Marhaba"),
  ("TO", "Tonga", "Malo e lelei"),
  ("TR", "Turkey", "Merhaba"),
  ("TT", "Trinidad and Tobago", "Hello"),
  ("TV", "Tuvalu", "Talofa"),
  ("TW", "Taiwan", "你好"),
  ("TZ", "Tanzania  United Republic of", "Habari"),
  ("UA", "Ukraine", "Pryvit"),
  ("UG", "Uganda", "Habari"),
  ("UK", "United Kingdom", "Hello"),
  ("UM", "United States Minor Outlying Islands", "Hello"),
  ("US", "United States", "Hello"),
  ("UY", "Uruguay", "Hola"),
  ("UZ", "Uzbekistan", "Salom"),
  ("VA", "Holy See (Vatican City State)", "Buon giorno"),
  ("VC", "Saint Vincent and the Grenadines", "Hello"),
  ("VE", "Venezuela", "Hola"),
  ("VG", "Virgin Islands  British", "Hello"),
  ("VI", "Virgin Islands  U.S.", "Hello"),
  ("VN", "Vietnam", "Chào"),
  ("VU", "Vanuatu", "Halo"),
  ("WF", "Wallis and Futuna", "Malo le kataki"),
  ("WS", "Samoa", "Talofa"),
  ("YE", "Yemen", "Marhaba"),
  ("YT", "Mayotte", "Hello"),
  ("ZA", "South Africa", "Hello"),
  ("ZM", "Zambia", "Hello"),
  ("ZW", "Zimbabwe", "Hello"),
  ("RD", "Reserved", "Hello")`;

  let parsed = text.split(",");
  let list = [];
  let greeting = "Hello";

  parsed.forEach(function (object) {
    list.push(object);
  });

  let countryCodes = [];
  let words = [];
  counter = 0;
  //countrycode indexes are divisible by 3:
  for (let i = 0; i < list.length; i++) {
    if (i % 3 === 0) {
      countryCodes.push(list[i]);
    }
    //Eery third element is hello-expression, so we can store it like this:
    counter++;
    if (counter === 3) {
      words.push(list[i]);
      counter = 0;
    }
  }
  console.log("countrycodes: " + countryCodes.length);
  console.log("hello-expressions: " + words.length);

  //let's change countrycode format to be same as in the countyCodes list:
  let formattedCountryCode = `("${weather.country}"`;
  console.log(formattedCountryCode);

  //Now we can search it with for loop:
  console.log(`Let's go to for-loop:`);
  for (let n = 0; n < countryCodes.length; n++) {
    if (countryCodes[n].includes(formattedCountryCode)) {
      console.log(`Hello in ${weather.country} is ${words[n]}`);
      let parts = words[n].split('"');
      console.log(parts);
      greeting = parts[1];
    }
  }
  //displaying it:
  greetingText.innerText = greeting;
}

function displayWindDirection() {
  console.log("Wind angle= " + weather.windDirection);
  document.getElementById("windDirection").style.transform =
    "rotate(" + weather.windDirection + "deg)";
}
