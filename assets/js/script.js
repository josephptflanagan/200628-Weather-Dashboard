function getWeatherData(cityName){

    //create the address to access the api for the chosen city
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=258563bcd408b087604452eb2e20b86f"

    fetch(weatherApiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                displayWeatherData(data, cityName);
            })
        }
        else{
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to Access Open Weather");
    })
};

function displayWeatherData(data, cityName){
    console.log(data);

    var cityButton = $("<button>")
        .addClass("btn")
        .text(cityName);

    $("#locations").append(cityButton);
};

//when the search bar is 
$("#search-button").on("click", function(){

    //get and store the city name from the search bar
    var cityName = $(this).siblings("#search-bar").val().trim();
    
    if(cityName == ""){
        return;
    }
    else{
    //Call the function that grabs the data
    getWeatherData(cityName);
    }
    
});