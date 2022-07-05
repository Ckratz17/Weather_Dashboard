
const weatherKey = '767baab1ba615005b7b57e268ed513fe';
const cityEl = $('h2#place')
const dateEl = $('h3#date')
const weatherIconEl = $('img#weather-icons')
const tempEl = $('span#temp')
const windEl = $('span#windSpeed')
const humidEl = $('span#humid')
const uvEl = $('span#uvIndex')
const cityListEl = $('div.cityList')

const cityInputs = $('#city-input')

let pastCity = []

