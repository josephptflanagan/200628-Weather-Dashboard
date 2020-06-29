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

function dateFormat(date, type){
    
    if(type == 0){
        var formattedDate = date.split("T")[0];
        var dateArr = formattedDate.split("-");
        return "(" + dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0] + ")";
    }
    else{
        var formattedDate = date.split(" ")[0];
        var dateArr = formattedDate.split("-");
        return dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
    }
        

};

/* NEEDS REVISION
function nameFormat(cityName){
    cityNameArr = cityName.split(" ");
    tempName = "";
    for(var i = 0; i < cityNameArr.length; i++){
        cityNameArr[i] = cityNameArr[i][0].toUpperCase() + cityNameArr[i].substr(1);
        tempName += cityNameArr[i];
        if(i == cityNameArr.length-1 && tempName.slice(-1) != ","){
            tempName += ", ";
        }
        else if(i < cityNameArr.length-1 && tempName){
            tempName += " ";
        }
    }
    return tempName;
};
*/
function getWeatherData(cityName){

    //create the address to access the api for the chosen city
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=258563bcd408b087604452eb2e20b86f"
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=258563bcd408b087604452eb2e20b86f"
    
    //fetch data from the weather api
    fetch(weatherApiUrl)
    
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=258563bcd408b087604452eb2e20b86f&lat=" + lat + "&lon=" + lon
                
                //fetch data from the weather api
                fetch(uvApiUrl).then(function(response){
                    if (response.ok){
                        response.json().then(function(uvData){                 
                        
                            fetch(forecastUrl).then(function(response){
                                if (response.ok){
                                    response.json().then(function(forecastData){ 

                                        //if data comes through, send it to be compiled
                                        compileWeatherData(data, uvData, forecastData, cityName);
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

function forecastCompiler(forecastData){
    
    //console.log("first min temp: " + forecastData.list[0].main.temp_min);

    var data = []; 

    // DATA: day 1 date | day 1 icon | day 1 low | day 1 high | day 1 humidity |
    //       day 2 date | day 2 icon | day 2 low | day 2 high | day 2 humidity |
    //       day 3 date | day 3 icon | day 3 low | day 3 high | day 3 humidity |
    //       day 4 date | day 4 icon | day 4 low | day 4 high | day 4 humidity |
    //       day 5 date | day 5 icon | day 5 low | day 5 high | day 5 humidity |

    for(var i = 0; i < 40; i = i+8){
        var min = null;
        var max = null;

        //console.log("i:" + i)

        var tempDate = forecastData.list[i].dt_txt;
        tempDate = dateFormat(tempDate, 1);

        var iconId = forecastData.list[i].weather[0].icon;
        //console.log("iconId:" + iconId)

        if(iconId[2] == "n"){

            iconId = iconId[0] + iconId[1] + "d";

        }

        var iconUrl = "https://openweathermap.org/img/wn/"+ iconId + "@2x.png";

        var humid = forecastData.list[i].main.humidity;

        for(var j = 0; j < 8; j++){
           
            //console.log("i+j: "+ (i+j));

            if(min == null || min < forecastData.list[i+j].main.temp_min){
               min = forecastData.list[i+j].main.temp_min
            }

           if(max == null || max > forecastData.list[i+j].main.temp_max){
               max = forecastData.list[i+j].main.temp_max
           }

        }
        data.push(tempDate);
        data.push(iconUrl);
        data.push(min);
        data.push(max);      
        data.push(humid);
        
    }
    return data;
}

//takes in both data files and the user input name, and creates cityDataObjects
function compileWeatherData(data, uvData, forecastData, cityName){
    //console.log(data);
    //console.log(uvData);
    //console.log(forecastData);

    var temperature = data.main.temp;
    var humid = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconID = data.weather[0].icon;
    var ultraViolet = uvData.value;
    var date = moment().format();

    var idGenerator = "city-" + idCounter
    idCounter++;

    var iconUrl = "https://openweathermap.org/img/wn/"+ iconID + "@2x.png";

    var formattedDate = dateFormat(date, 0);

    var forecast = forecastCompiler(forecastData);

    var cityDataObj = {
        name: cityName,
        id: idGenerator,
        humidity: humid,
        temp: temperature,
        wind: windSpeed,
        icon: iconUrl,
        uv: ultraViolet,
        date: formattedDate,
        fiveDay: forecast
    };
    
    var alreadyStored = false;
    for(var i = 0; i < cities.length;i++){
        if(cityDataObj.name == cities[i].name){
            cities[i] = cityDataObj;
            alreadyStored = true;
        }
    }
    if(alreadyStored == false){
        cities.push(cityDataObj);
    }
    

    saveCities();

    display(cityDataObj);   

};
//Takes in cityDataObjects and passes them on to all 3 display programs
function display(cityDataObj){
    displayCityButtons(cityDataObj);
    displayCurrentWeatherData(cityDataObj);
    displayForecastWeatherData(cityDataObj);
};

//creates the city buttons and adds them to the HTML
function displayCityButtons(cityWeatherObject){

    var deleteX = $("<i>")
        .addClass("icofont-close delete-icon");
    
    var cityDeleteButton = $("<button>")
        .addClass("delete-btn")
        .attr("id", cityWeatherObject.id)
        .append(deleteX);

    var cityButton = $("<button>")
        .addClass("city-btn")
        .attr("id", cityWeatherObject.id)
        .text(cityWeatherObject.name);

    var cityPlateLeft = $("<div>")
        .addClass("col-10 button-div")
        .append(cityButton);

    var cityPlateRight = $("<div>")
        .addClass("col-2 button-div")
        .append(cityDeleteButton);

    var cityPlate = $("<div>")
        .addClass("row")
        .attr("id", cityWeatherObject.id)
        .append(cityPlateLeft, cityPlateRight);

    $("#locations").prepend(cityPlate);

};

//creates the current weather card and appends it to the HTML
function displayCurrentWeatherData(cityWeatherObject){

    var icon = $("<img>")
        .attr("src", cityWeatherObject.icon);

    var cityTitle = $("<h3>")
        .text(cityWeatherObject.name + " " + cityWeatherObject.date)
        .append(icon);

    var tempLevel = $("<p>")
        .text("Temperature: " + cityWeatherObject.temp + " °F");

    var humidityLevel = $("<p>")
        .text("Humdity: " + cityWeatherObject.humidity + "%");

    var windLevel = $("<p>")
        .text("Wind Speed: " + cityWeatherObject.wind + " MPH");
        
    var uvSpan = $("<span>")
        .css("background-color", uvColor(cityWeatherObject.uv)[0])
        .css("color", uvColor(cityWeatherObject.uv)[1])
        .text(cityWeatherObject.uv);
    
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
};

function displayForecastWeatherData(cityWeatherObject){

    // DATA: day 1 date | day 1 icon | day 1 low | day 1 high | day 1 humidity |
    //       day 2 date | day 2 icon | day 2 low | day 2 high | day 2 humidity |
    //       day 3 date | day 3 icon | day 3 low | day 3 high | day 3 humidity |
    //       day 4 date | day 4 icon | day 4 low | day 4 high | day 4 humidity |
    //       day 5 date | day 5 icon | day 5 low | day 5 high | day 5 humidity |

    $("#five-day").empty();

    var forecastTitle = $("<h3>")
        .addClass("row")
        .text("5-Day Forecast: ");

    var datePlate = $("<div>")
        .attr("id", "date-plate")
        .addClass("row");

    $("#five-day").append(forecastTitle, datePlate);

    for(var i = 0; i < 5; i++){
    
        var date = $("<h5>")
            .text(cityWeatherObject.fiveDay[i*5]);

        var icon = $("<img>")
            .attr("src", cityWeatherObject.fiveDay[i*5+1]);

        var tempMax = $("<p>")
            .text("High: " + cityWeatherObject.fiveDay[i*5+2] + " °F");

        var tempMin = $("<p>")
            .text("Low: " + cityWeatherObject.fiveDay[i*5+3] + " °F");

        var Humidity = $("<p>")
            .text("Humidity: " + cityWeatherObject.fiveDay[i*5+4] + " %");
            
        var forecastCard = $("<div>")
            .addClass("forecast-card col-lg-2")
            .append(date, icon, tempMax, tempMin, Humidity);

        $("#date-plate").append(forecastCard);

    }

};

function deleteCity(cityId){

    console.log("entered delete function");
    //console.log("deleteCity Accessed, cityID: " + cityId);
    var citySelected = $("#" + cityId).parent(".row").prevObject[0];
    //console.log(citySelected);
    citySelected.remove();

    var updatedCities = [];

    //loop through city list
    for (var i = 0; i < cities.length; i++){
        //if cities[i].id doesn't match the value of the current city it is kept, thus
        //only the city being deleted is not added to the array
        console.log("cities[i].id:" + cities[i].id + ", cityId: " + cityId);
        if (cities[i].id !==cityId){
            updatedCities.push(cities[i]);
        }
    }
    console.log("updatedCities:" + updatedCities);
    console.log("cities:" + cities);
    //reassign cities array to be the same as updatedcities
    cities = updatedCities;

    console.log("cities:" + cities);

    saveCities();

    //update current weather display to remove data from deleted city
    if(cities.length != 0){
        displayCurrentWeatherData(cities[cities.length-1]);
    }
    

};

function saveCities(){
    //console.log("saveCities, cities: " + JSON.stringify(cities));
    localStorage.clear();
    localStorage.setItem("cities", JSON.stringify(cities));
};

function loadCities(){
    //grabs saved cities
    var loadedCities = localStorage.getItem("cities");

    localStorage.clear();

    if(!loadedCities){
        cities = [];
        return false;
    };

    //parses saved cities and adds to cities array
    cities = JSON.parse(loadedCities);

    for(var i = 0;i < cities.length;i++){
        getWeatherData(cities[i].name);      
    }
    
};

//when the search bar is 
$("#search-button").on("click", function(){

    //get and store the city name from the search bar
    var cityName = $(this).siblings("#search-bar").val().trim();

    //cityName = nameFormat(cityName); Formatting not working correctly,
    //                                  will reopen route when it is fixed
    
    if(cityName != ""){
        //control to keep from searching the same name twice
        for(var i = 0; i < cities.length; i++){
            if(cityName == cities[i].name){
                alert("That City is Already Listed")
                return
            }
        }
        //sends viable city name to the GetWeatherData function
        getWeatherData(cityName);
    }
    else{
        return;
    }

});

$("#locations").on("click", function(){
    //console.log(event.target);

    if(event.target.matches(".city-btn")){
        var cityId = event.target.getAttribute("id");
        //console.log("cityId: " + cityId);
        for(var i = 0; i < cities.length; i++){
            if(cities[i].id == cityId){
               displayForecastWeatherData(cities[i]);
               displayCurrentWeatherData(cities[i]);
            }
        }
        
    }    
    else if(event.target.matches(".delete-btn")){
        var cityId = event.target.getAttribute("id");
        deleteCity(cityId);
    }

});

loadCities();