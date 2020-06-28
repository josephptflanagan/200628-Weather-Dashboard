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
                                    
                        //if data comes through, send it and the city name to display function
                        compileWeatherData(data, uvData, cityName);

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

//takes in both data files and the user input name, and creates cityDataObjects
function compileWeatherData(data, uvData, cityName){
    //console.log(data);
    //console.log(uvData);

    var temperature = data.main.temp;
    var humid = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconID = data.weather[0].icon;
    var ultraViolet = uvData.value;
    var date = uvData.date_iso;
    var timeCreated = moment();
    
    var idGenerator = "city-" + idCounter

    idCounter++;

    var iconUrl = "https://openweathermap.org/img/wn/"+ iconID + "@2x.png";

    var formattedDate = dateFormat(date);

    var cityDataObj = {
        name: cityName,
        id: idGenerator,
        humidity: humid,
        temp: temperature,
        wind: windSpeed,
        icon: iconUrl,
        uv: ultraViolet,
        date: formattedDate,
        time: timeCreated
    };
    
    //if the city is already in the array, update it
    if(cities.length != 0){

        var alreadySaved = false;

        for(var i = 0;i < cities.length;i++){
            if(cities[i].name == cityName){
                alreadySaved = true;
            }
        }

        if(!alreadySaved){
            cities.push(cityDataObj);
        }
        
    }  
    //Otherwise, add it to the array
    else if(cities.length == 0){
        console.log("adding new city");
        console.log("cities: " + cities);
        cities.push(cityDataObj);
        console.log("cities: " + cities);
    }
   
    saveCities();

    display(cityDataObj);   

};
//Takes in cityDataObjects and passes them on to all 3 display programs
function display(cityDataObj){
    displayCityButtons(cityDataObj);
    displayCurrentWeatherData(cityDataObj);
    //displayForecastWeatherData(cityDataObj);
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

};




function deleteCity(cityId){

    //console.log("deleteCity Accessed, cityID: " + cityId);
    var citySelected = $("#" + cityId).parent(".row").prevObject[0];
    //console.log(citySelected);
    citySelected.remove();

    var updatedCities = [];

    //loop through city list
    for (var i = 0; i < cities.length; i++){
        //if cities[i].id doesn't match the value of the current city it is kept, thus
        //only the city being deleted is not added to the array
        if (cities[i].id !==cityId){
            updatedCities.push(cities[i]);
        }
    }

    //reassign cities array to be the same as updatedcities
    cities = updatedCities;

    saveCities();

    //update current weather display to remove data from deleted city
    if(cities.length != 0){
        displayCurrentWeatherData(cities[cities.length-1]);
    }
    

};

function saveCities(){
    //console.log("saveCities, cities: " + JSON.stringify(cities));
    localStorage.setItem("cities", JSON.stringify(cities));
};

function loadCities(){
    //grabs saved cities
    var loadedCities = localStorage.getItem("cities");

    if(!loadedCities){
        cities = [];
        return false;
    };

    //parses saved cities and adds to cities array
    cities = JSON.parse(loadedCities);

    //stores current time
    var currentTime = moment();

    for(var i = 0;i < cities.length;i++){

        //checks if 3 hours have passed since the saved locations have had their data 
        //at open weather accessed. As the data only updates every three hours, it doesn't
        //make sense to regather the data
        if(currentTime.diff(cities[i].time) > 10800000){
            console.log("a minimum of 3 hours have passed, grabbing more data");
            getWeatherData(cities[i].name);
        }
        //updates the city id so that ids and the counter are up to date for new locations
        cities[i].id = "city-" + idCounter;
        idCounter++;
        //sends the currently loaded city to the display function
        display(cities[i]);
        
    }

    //used to make sure the new id numbers are assigned
    saveCities();

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