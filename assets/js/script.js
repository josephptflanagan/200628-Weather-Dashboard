var idCounter = 0;
var cities = [];

function uvColor(uvIndex){

    var color = ["magenta", "white"];

    if (uvIndex >= 0 && uvIndex < 3){
        color = ["green", "white"];
    }
    else if (uvIndex >= 3 && uvIndex < 6){
        color = ["yellow", "black"];
    }
    else if (uvIndex >= 6 && uvIndex < 8){
        color = ["orange", "white"];
    }
    else if (uvIndex >= 8 && uvIndex < 11){
        color = ["red", "white"];
    }
        return color;
    
};

function dateFormat(date){
    var formattedDate = date.split("T")[0];
    var dateArr = formattedDate.split("-");
    return "(" + dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0] + ")";
};

function capitalize(cityName){
    cityNameArr = cityName.split(" ");
    tempName = "";
    for(var i = 0; i < cityNameArr.length; i++){
        cityNameArr[i] = cityNameArr[i][0].toUpperCase() + cityNameArr[i].substr(1);
        tempName += cityNameArr[i];
        if(i < cityNameArr.length-1){
            tempName += " ";
        }
    }
    return tempName;
};

function getWeatherData(cityName){

    //create the address to access the api for the chosen city
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=258563bcd408b087604452eb2e20b86f"
    
    //fetch data from the weather api
    fetch(weatherApiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=258563bcd408b087604452eb2e20b86f&lat=" + lat + "&lon=" + lon
                
                //fetch data from the weather api
                fetch(uvApiUrl).then(function(response){
                    if (response.ok){
                        response.json().then(function(uvData){                 
                                    
                        //if data comes through, send it and the city name to display function
                        displayWeatherData(data, uvData, cityName);
                        })
                    }
                    else{
                        alert("Error: " + response.statusText);
                    }
                })
                .catch(function(error){
                    alert("Unable to Access Open Weather");
                })
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

function displayWeatherData(data, uvData, cityName){
    //console.log(data);
    //console.log(uvData);
    
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconID = data.weather[0].icon;
    var uv = uvData.value;
    var date = uvData.date_iso;

    var iconUrl = "https://openweathermap.org/img/wn/"+ iconID + "@2x.png";

    var formattedDate = dateFormat(date);

    var icon = $("<img>")
        .attr("src", iconUrl);

    var cityTitle = $("<h3>")
        .text(cityName + " " + formattedDate)
        .append(icon);

    var tempLevel = $("<p>")
        .text("Temperature: " + temperature + " °F");

    var humidityLevel = $("<p>")
        .text("Humdity: " + humidity + "%");

    var windLevel = $("<p>")
        .text("Wind Speed: " + windSpeed + " MPH");
        
    var uvSpan = $("<span>")
        .css("background-color", uvColor(uv)[0])
        .css("color", uvColor(uv)[1])
        .text(uv);
    
    var uvLevel = $("<p>")
        .text("UV index: ")
        .append(uvSpan);

    var cardContent = $("<div>")
        .addClass("card-content")
        .append( cityTitle, tempLevel, humidityLevel, windLevel, uvLevel);

    var today = $("<div>")
        .addClass("card")
        .append( cardContent);

    $("#today").empty();

    $("#today").append(today);

    //add buttons for searched cities
    var cityButton = $("<button>")
        .addClass("btn")
        .attr("id", "city-button-" + idCounter)
        .text(cityName);

    $("#locations").append(cityButton);
    
    idCounter++;

};

//when the search bar is 
$("#search-button").on("click", function(){

    //get and store the city name from the search bar
    var cityName = $(this).siblings("#search-bar").val().trim();

    cityName = capitalize(cityName);
    
    if(cityName == ""){
        return;
    }
    else{
    //Call the function that grabs the data
    getWeatherData(cityName);
    }

});

$("#city-button-").on("click", function(){
    console.log("button pressed");
    var cityName = $(this).val();

    

    //getWeatherData(cityName);

});