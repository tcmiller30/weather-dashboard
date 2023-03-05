var apiKey = '49c0818e6f1401c1322781925512f785'

function fetchCoordinates(input){
    
    var coordinatesRequestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + input + '&limit=5&appid=' + apiKey;
    fetch(coordinatesRequestUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var lat = data[0].lat
            var lon = data[0].lon
            $('#currentCity').text(`${data[0].name}: `)
            storePastSearches(data[0].name);
            fetchForecast(lat, lon);
            // fetchWeatherNow(lat, lon);
        })
}

function fetchForecast(lat, lon){
    var forecastRequestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${apiKey}`
    fetch(forecastRequestUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            var unixTime = data.current.dt; 
            var cDate = dayjs.unix(unixTime).format('MM/DD/YYYY')
            var cIcon = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
            $('#currentDate').text(cDate);
            // Current Weather
            $('#currentTemp').text(`${data.current.temp}\u00B0F`);
            $('#currentWind').text(`${data.current.wind_speed}mph`);
            $('#currentHumid').text(`${data.current.humidity}%`);
            $('#currentWeatherImage').attr('src', cIcon);
            // $('#currentDate').text(unixConverted)
            // Five Day Forecast
            
            forecastCards(data.daily);

        })
}   

function forecastCards(data){
    console.log(data)
    $('#forecastRow').html('');
    for(var i = 0; i < 5; i++){
        var fDate = dayjs.unix(data[i].dt).format('MM/DD/YYYY');
        var fIcon = `https://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`;
        var fTemp = `${data[i].temp.day}\u00B0F`;
        var fWind = `${data[i].wind_speed}mph`;
        var fHumid = `${data[i].humidity}%`;

        document.getElementById('forecastRow').innerHTML += 
       `<div class="col col-md-6 col-lg-4 mb-3">
        <div class="card p-2 p-md-3">
        <h5 class="text-center">${fDate}</h5>
        <img src="${fIcon}" class="mx-2 rounded-circle card-image mb-3">
        <p>Temp: <span class="cardTemp">${fTemp}</span></p>
        <p>Wind: <span class="cardWind">${fWind}</span></p>
        <p>Humidity: <span class="cardHumid">${fHumid}</span></p>
        </div>
        </div`
    }
    
}

function storePastSearches (search){
    var pastSearches = JSON.parse(window.localStorage.getItem('pastSearches')) || [];
    var newSearch = search
//  If theres an index in the pastSearches array that
    if(pastSearches.indexOf(newSearch) !== -1){
        pastSearches.splice(pastSearches.indexOf(newSearch), 1);
    }
    pastSearches.push(newSearch);

    window.localStorage.setItem('pastSearches', JSON.stringify(pastSearches));
    displayPastSearches();
}

// Gets values from localStorage and appends buttons to pastSearches container in the HTML
function displayPastSearches(){
    var pastSearches = JSON.parse(window.localStorage.getItem('pastSearches'));
    var displayedSearches = pastSearches.reverse().slice(0, 9)
    document.getElementById('pastSearches').innerHTML = '';
    for(var i = 0; i < displayedSearches.length; i++){
        
        document.getElementById('pastSearches').innerHTML +=
        `<button class="btn btn-secondary my-4 pastResult">${displayedSearches[i]}</button>`;
    }
}
// Checks if localStorage is empty on load, if it's not, displayPastSearches() executes
if(localStorage.getItem('pastSearches') !== null){
    displayPastSearches(); 
}

// Event listeners for buttons
$('#searchBtn').on('click', function(){
    var input = $('#input').val();
    fetchCoordinates(input);
    $('#input').val('');
})
// Listens for clicks on elements with .pastResult class in #pastSearches container
$('#pastSearches').on('click', '.pastResult', function(){
    var input = $(this).text();
    fetchCoordinates(input);
})
$('#clearSearches').on('click', function(){
    window.localStorage.clear();
    $('#pastSearches').html('')
})

