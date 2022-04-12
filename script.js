var searchBtn = $('#searchBtn')
var cityNameInput = $('#cityNameInput')
var searchHistoryArea = $('#searchHistoryArea')
var infoArea = $('#infoArea')
var searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'))||[]
const maxSearchHistorySize = 10
var apiKey = "cc09dda6a0046068b344f5f5d0903567"
var test
function init(){
    displaySearchHistory()
}
init()

function searchBtnClicked(event){
    event.preventDefault()
    var cityName = cityNameInput.val().trim()
    searchForCity(cityName)
    updateSearchHistory(cityName)
    clearSearchHistory()
    displaySearchHistory()
}

// search History related
function handleSearchHistory(event) {

}

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

function displaySearchHistory(){
    searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'))||[]
    for (let index = 0; index < searchHistoryList.length; index++) {
        var btnElement = $('<button>').addClass('btn btn-secondary form-control mb-3').text(searchHistoryList[index])
        searchHistoryArea.append(btnElement)
    }
}

function clearSearchHistory(){
    searchHistoryArea.children().remove()
}


// api call related
async function searchForCity(cityName){
    var coord = await getCityCoord(cityName)
    var data = await fetch(getOneCallURL(coord)).json()
    displayCurrentData(data)
    display5DayData(data)
}

async function getCityCoord(cityName){
    var response = await fetch(getGeocodeURL(cityName))
    var data = await response.json()
    var coord = {lat:data[0].lat,lon:data[0].lon}
    return coord
}

function getGeocodeURL(cityName){
    var url = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey + "&limit=1"
    return url
}

function getOneCallURL(coord){
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + apiKey + "&units=metric"
    return url
}

// display api data
function displayCurrentData(data){

}

function display5DayData(data){

}

function clearInfo(){
    infoArea.children().remove()
}

searchBtn.on('click', searchBtnClicked)
searchHistoryArea.on('click', '.historyBtn', handleSearchHistory)