var searchBtn = $('#searchBtn')
var cityNameInput = $('#cityNameInput')
var searchHistoryArea = $('#searchHistoryArea')
var infoArea = $('#infoArea')
var searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'))||[]
const maxSearchHistorySize = 10

function init(){
    displaySearchHistory()
}
init()

function searchBtnClicked(event){
    event.preventDefault()
    var cityName = cityNameInput.val()
    updateSearchHistory(cityName)
    clearSearchHistory()
    displaySearchHistory()
}

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

function searchForCity(cityName){

}

function displayCityData(data){

}

function clearInfo(){
    infoArea.children().remove()
}

searchBtn.on('click', searchBtnClicked)
searchHistoryArea.on('click', '.historyBtn', searchHistoryAreaClicked)