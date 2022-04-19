// initial global variables
var searchBtn = $('#searchBtn')
var cityNameInput = $('#cityNameInput')
var searchHistoryArea = $('#searchHistoryArea')
var infoArea = $('#infoArea')
var searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'))||[]
const maxSearchHistorySize = 10
var apiKey = "cc09dda6a0046068b344f5f5d0903567"


// init function, get called once on startup
function init(){
    displaySearchHistory()
}
init()

// handle search button
function searchBtnClicked(event){
    event.preventDefault()
    var cityName = cityNameInput.val().trim()
    searchForCity(cityName)
    updateSearchHistory(cityName)
    clearSearchHistory()
    displaySearchHistory()
}

// handle search History buttons
function handleSearchHistory(event) {
    var target = $(event.target)
    var cityName = target.text()
    searchForCity(cityName)
}

// update changed search History to localStorage
function updateSearchHistory(cityName){
    if (cityName == ''){
        return
    }
    if (!searchHistoryList.includes(cityName)){
        searchHistoryList.splice(0, 0, cityName)
        while (searchHistoryList.length > maxSearchHistorySize){
            searchHistoryList.pop()
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList))
    }
}

// pull data from localStorage and display search History buttons
function displaySearchHistory(){
    searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'))||[]
    for (let index = 0; index < searchHistoryList.length; index++) {
        var btnElement = $('<button>').addClass('btn btn-secondary historyBtn form-control mb-3').text(searchHistoryList[index])
        searchHistoryArea.append(btnElement)
    }
}

// clear the search history area to populate new one
function clearSearchHistory(){
    searchHistoryArea.children().remove()
}


// api call related
async function searchForCity(cityName){
    var detail = await getCityDetail(cityName)
    var response = await fetch(getOneCallURL(detail.coord))
    var data = await response.json()
    clearInfo()
    console.log(data)
    displayCurrentData(detail.name, data.current)
    display5DayData(data.daily)
}

// get name of the city and its coordinate to use with onecall api
async function getCityDetail(cityName){
    var response = await fetch(getCityDetailURL(cityName))
    var data = await response.json()
    var detail = {name: data.name, coord: data.coord}
    return detail
}


// get URL for the getCityDetail function
function getCityDetailURL(cityName){
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey
    return url
}

// get URL for oneCall API function
function getOneCallURL(coord){
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + apiKey + "&units=metric"
    return url
}

// convert UNIX time from api response to Readable time and date
function convertUnixToString(date){
    var options = {day: 'numeric', month: 'numeric', year: 'numeric'}
    var res = new Intl.DateTimeFormat('en-AU', options).format(date)
    return res
}

// get URL for the icon of the weather from api
function getIconLink(id){
    var iconLink = "http://openweathermap.org/img/wn/" + id + ".png"
    return iconLink
}

// display current weather info
function displayCurrentData(cityName, data){
    var currentDataArea = $('<div>').addClass('border border-success border-1 bg-info p-2 mb-3')

    // convert unix date from api to readable date
    var date = new Date(data.dt*1000)
    
    var header = $('<h2>').text(cityName + " ("+ convertUnixToString(date) +")")
    // adding weather icon
    var iconLink = getIconLink(data.weather[0].icon)
    var icon = $('<img>').attr('src', iconLink)
    console.log(iconLink)
    header.append(icon)
    var temp = $('<p>').text("Temp: " + data.temp + "°C")
    var wind = $('<p>').text("Wind: " + data.wind_speed + " MPH")
    var humid = $('<p>').text("Humidity: " + data.humidity + "%")
    var UV = $('<p>').text('UV Index: ')
    var UVspan = $('<span>').addClass('text-white p-2').attr('style','display: inline-block;').text(data.uvi)
    // check UV data and display appopriate color code
    if (data.uvi <= 2){
        UVspan.attr('style','background-color: green;')
    }
    else if(2<data.uvi<=5){
        UVspan.attr('style','background-color: yellow;')
    }
    else if(5<data.uvi<=7){
        UVspan.attr('style','background-color: orange;')
    }
    else if(7<data.uvi<=10){
        UVspan.attr('style','background-color: red;')
    }
    else if(data.uvi>10){
        UVspan.attr('style','background-color: violet;')
    }
    UV.append(UVspan)
    currentDataArea.append(header,temp,wind,humid,UV)
    infoArea.append(currentDataArea)
}

// display 5 day forecast info in 5 cards 
function display5DayData(data){
    var header = $('<h2>').text('5-Day Forecast:')
    infoArea.append(header)
    for (var i=1; i < 6; i++){
        var fiveDayArea = $('<div>').addClass('card mx-2 mb-2 col-sm-12 col-lg-5 col-xl-2 flex-fill bg-secondary')
        var cardBody = $('<div>').addClass('card-body text-white text-center')
        fiveDayArea.append(cardBody)
        var date = new Date(data[i].dt*1000)
        var dateText = $('<h5>').text(convertUnixToString(date))
        var icon = $('<img>').attr('src', getIconLink(data[i].weather[0].icon))
        var temp = $('<p>').text('Temp: ' + data[i].temp.day + "°C")
        var wind = $('<p>').text('Wind: ' + data[i].wind_speed + " MPH")
        var humid = $('<p>').text('Humidity: ' + data[i].humidity + "%")
        cardBody.append(dateText, icon, temp, wind, humid)
        fiveDayArea.append(cardBody)
        infoArea.append(fiveDayArea)
    }
    
}

// clear the infoArea to populate new info
function clearInfo(){
    infoArea.children().remove()
}

// add eventListener to appopriate button and area
searchBtn.on('click', searchBtnClicked)
searchHistoryArea.on('click', '.historyBtn', handleSearchHistory)