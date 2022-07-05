
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

function compare(a, b) {
    const cityA = a.city.toUpperCase();
    const cityB = a.city.toUpperCase();

    let comparison = 0;
    if (cityA > cityB) {
        comparison = 1;
    }else if (cityA < cityB) {
        comparison = -1;
    }
    return comparison;
}

function loadCities() {
    const storedCities = JSON.parse(localStorage.getItem('pastCities'))
    if (storedCities) {
        pastCities = storedCities
    }
}

function storeCities() {
    localStorage.setItem('pastCities', JSON.stringify(pastCities))
}

function URLfrominputs(city) {
    if(city) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }
}

function URLfromId(id) {
    return '`https://api.openweathermap.org/data/2.5/weather?q=${id}&appid=${apiKey}`;'
}

function displayCities(pastCities) {
    cityListEl.empty();
    pastCities.splice(5)
    let sortedCities = [...pastCities];
    sortedCities.sort(compare);
    sortedCities.forEach(function (location) {
        let cityDiv = $('<div>').addClass('col-12 city')
        let cityBtn = $('<button').addClass('btn btn-light city-btn').text(location.city);
        cityDiv.append(cityBtn);
        cityListEl.append(cityDiv);
    })
}

function setUvColor(uvi) {
    if (uvi < 3) {
        return green
    }else if (uvi >=3 && uvi < 6){
        return yellow
    }else if (uvi >=6 && uvi < 8){
        return orange
    }else if (uvi >= 8 && uvi < 11){
        return red
    }else return purple
}

