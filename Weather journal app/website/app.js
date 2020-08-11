const localhostURL = 'http://localhost:3000'

const zipCodeInput = document.getElementById('zip');
const feelingInput = document.getElementById('feelings');

const openWeatherMapApiKey = '2723876f9be3de0a2da56e745a5aaf87'
const openWeatherMapURL = 'http://api.openweathermap.org/data/2.5/weather'


const zipCodeErrorField = document.getElementById('zip-error');
const feelingErrorField = document.getElementById('feeling-error');

const cityMessageField = document.getElementById('city-message');


const entryDateHolder = document.getElementById('date');
const entryTemperatureHolder = document.getElementById('temp');
const entryContentHolder = document.getElementById('content');

let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const generateButton = document.getElementById('generate');

generateButton.addEventListener('click', clickedGenerate)


async function clickedGenerate() {
  const zipCode = zipCodeInput.value;
  const feeling = feelingInput.value;


  const hasError = validateInput(zipCode, feeling);

  if (hasError) {

    return;
  }


  const weatherData = await getWeatherData(zipCode);


  if (weatherData.cod === '404') {

    cityWasNotFound();

    return;
  } else {

    cityFound(weatherData.name);
  }

  const {
    main: {
      temp: temperature
    }
  } = weatherData;


  await addData(zipCode, feeling, temperature);


  const projectData = await getData();

  console.log('projectData', projectData);


  const {
    data
  } = projectData;
  console.log('data', data);
  const latestEntry = data[data.length - 1];
  console.log('latestEntry', latestEntry);
  showLatestEntry(latestEntry);
}



async function getWeatherData(zipCode) {


  const weatherApiURL = openWeatherMapURL + `?zip=${zipCode}&appid=${openWeatherMapApiKey}&units=imperial`

  return new Promise((resolve, reject) => {
    fetch(weatherApiURL)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}


async function addData(zipCode, feeling, temperature) {

  const postDataURL = localhostURL + '/';

  return new Promise((resolve, reject) => {
    fetch(postDataURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCode,
          feeling,
          temperature,
          date: newDate,
        })
      })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  })
}


async function getData() {
  const getDataURL = localhostURL + '/all';

  return new Promise((resolve, reject) => {
    fetch(getDataURL)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

function validateInput(zipCode, feeling) {

  let hasError = false;

  if (!zipCode || !/^[0-9]{5}(?:-[0-9]{4})?$/.test(zipCode)) {

    hasError = true;
    zipCodeErrorField.innerText = 'Incorrect Input';
  } else {

    zipCodeErrorField.innerText = '';
  }

  if (!feeling) {
    hasError = true;

    feelingErrorField.innerText = 'Incorrect Input'
  } else {
    feelingErrorField.innerText = ''
  }

  return hasError;
}

function cityWasNotFound() {
  cityMessageField.innerText = 'City with given Zipcode was not found';
  cityMessageField.classList.add('error');
}

function cityFound(cityName) {
  cityMessageField.innerText = `Retrieved weather data for ${cityName}`;
  cityMessageField.classList.remove('error');
}

function showLatestEntry(latestEntry) {
  const {
    zipCode,
    feeling,
    temperature,
    date
  } = latestEntry;

  entryDateHolder.innerText = `Date: ${date}`;
  entryTemperatureHolder.innerText = `Temperature: ${temperature}`;
  entryContentHolder.innerText = `Feeling: ${feeling}, Temperature: ${temperature}, Zipcode: ${zipCode}`;
}