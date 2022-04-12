var searchBtn = $('#searchBtn')
var cityNameInput = $('#cityNameInput')
var searchHistoryArea = $('#searchHistoryArea')
var infoArea = $('#infoArea')
var searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'))||[]

function searchBtnClicked(){
    
}

function handleSearchHistory(event) {

}

function updateSearchHistory(cityName){

}

function displaySearchHistory(){

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