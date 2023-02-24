var apiKey = '49c0818e6f1401c1322781925512f785'


function fetchCoordinates(input){
    
    var coordinatesRequestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=5&appid=' + apiKey;
    fetch(coordinatesRequestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var lat = data[0].lat
            var lon = data[0].lon
            console.log(lat, lon)
            fetchForecast(lat, lon);
            fetchWeatherNow(lat, lon);
        })
}
function fetchWeatherNow(lat, lon){
    var currentRequestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' +apiKey;
    fetch(currentRequestUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            $('#currentCity').text(`${data.name} / ${dayjs.unix(data.dt).format('MMM DD, YYYY @ hh:mma')}`)
            $('#currentWeatherImage').attr('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
            $('#currentTemp').text(`${data.main.temp} \u00B0F`);
            $('#currentWind').text(`${data.wind.speed} mph`);
            $('#currentHumid').text(`${data.main.humidity} %`);
            
        })
}
function fetchForecast(lat, lon){
    var forecastRequestUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat +'&lon=' + lon + '&units=imperial&appid=' + apiKey;
    fetch(forecastRequestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var weatherType
            var weatherIconId 
            console.log(data);
        })
}

$('#searchBtn').on('click', function(){
    var input = $('#input').val();
    fetchCoordinates(input)
})

$('.pastResult').on('click', function(){
    var input = $(this).text();
    fetchCoordinates(input);
})