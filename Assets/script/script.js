var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var today = moment().format('L')
var searchHistory = []

//function to display the current weather from the api and append it to the page
function currentWeather(city) {

    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(cityWeather) {
        console.log(cityWeather);

        $("#currentWeather").css("display", "block")
        $("#cityInfo").empty()

        var iconCode = cityWeather.weather[0].iconCode
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `)
        $("cityDetail").append(currentCity)

        var lat = cityWeather.coord.lat
        var lon = cityWeather.coord.lon
        var uviUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

        $.ajax({
            url: uviUrl,
            method: 'GET'
        }).then(function(uviResponse) {
            console.log(uviResponse)

            var uvIndex = uviResponse.value;
            var uvIndexPara = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);

            $("#cityInfo").append(uvIndexPara)

            futureForecast(lat, lon)

            if(uvIndex >= 0 && uvIndex <= 2) {
                $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white")
            }else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvIndexColor").css("background-color", "#fff300")
            }else if (uvIndex >= 6 && uvIndex <= 7) {
                $("#uvIndexColor").css("background-color", "#F18B00")
            }else if (uvIndex >= 8 && uvIndex <= 10) {
                $("#uvIndexColor").css("background-color", "#E53210").css("color", "white")
            }else {
                $("uvIndexColor").css("background-color", '#B567A4').css("color", "white")
            };
        });
    });
}
//function to display the 5 day forecast from the api and append it to the page
function futureForecast(lat, lon) {

    var fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

     $.ajax({
        url: fiveDayUrl,
        method: 'GET'
     }).then(function(Response) {
        console.log(Response)
        $('#fiveDay').empty()

        for(let i = 1; i < 6; i++) {
            var cityInfo = {
                date: Response.daily[i].dt,
                icon: Response.daily[i].weather[0].icon,
                temp: Response.daily[i].temp.day,
                humidity: Response.daily[i].humidity
            }

            var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY")
            var iconUrl = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

            var card = $(`
                <div class="pl-3>
                    <div class ="card pl-3 pt--3 mb-3 bg-primary text-light style=width: 12rem>
                        <div class ="card-body>
                            <h5>${currentDate}</h5>
                            <p>${iconUrl}</p>
                            <p>Temp: ${cityInfo.temp} F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                </div>
            `)
            $("#fiveDay").append(card)
        }
    })

}