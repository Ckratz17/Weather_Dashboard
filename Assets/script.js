
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

function searchWeather(queryURl) {

    $.ajax({
        url: queryURl,
        method: 'Get'
    }).then(function (response){

        let city = response.name;
        let id = response.id;
        if(pastCities[0]) {
            pastCities = $.grep(pastCities, function (storedCity) {
                return id !== storedCity.id;
            })
        }
        pastCities.unshift({ city, id });
        storeCities();
        displayCities(pastCities);

        cityEl.text(response.name);
        let formattedDate = moment.unix(response.dt).format('L');
        dateEl.text(formattedDate);
        let weatherIcon = response.weather[0].icon;
        weatherIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description)
        tempEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1))
        humidEl.text(response.main.humidity)
        windEl.text((response.wind.speed * 2.237).toFixed(1))

        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let urlAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $ajax({
            url: urlAll,
            method: 'Get'
        }).then(function (response) {
            let uvIndex = response.current.uvi;
            let uvColor = setUvColor(uvIndex)
            uvEl.text(response.current.uvi)
            uvEl.attr('style', 'background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}')
            let fiveDay = response.daily;

            for (let i = 0; i <= 5; i++) {
                let currDay = fiveDay[i];
                $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'))
                $(`div.day-${i} .fiveDay-img`).attr(
                    'src',
                    `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                ).attr('alt', currDay.weather[0].description);
                $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity)
                $(`div.day-${i} .fiveDay-wind`).text((response.wind.speed * 2.237).toFixed(1))
            }
        })
    })
}