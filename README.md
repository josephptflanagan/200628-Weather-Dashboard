# Weather Dashboard

## GitHub Repository URL
https://github.com/josephptflanagan/Weather-Dashboard

## Site URL
https://josephptflanagan.github.io/Weather-Dashboard/

## Screenshot
https://github.com/josephptflanagan/Weather-Dashboard/blob/master/assets/images/screenshot.png

### How it Works
First Time Users of the site are welcomed by a header and a searchbar. Once they type a city name into the search bar and hit the search button the name is sent to the getWeatherData function that accesses the relavent data within the Open Weather Database. This data is used to contruct a cityDataOject. The cityDataObject is then added to the cities array and saved to local storage, after which it is sent to the display function which calls all three separate display functions (city cards, current day forecast, 5 day forecast). 

When citybuttons are pressed, they call for the display of their weather data.

When the deletebuttons are pressed, the delete their button and remove the content from the save data.

When data is loaded from the localStorage, it sends the name of the city up to search for new data. When this happens, new data is gathered, a new object is created, and when this object is found to have the same name as an existing dataobject, that old object is overwritten by the new one. Objects are then pressed into the display function. 

The only issues I would like to fix is to make city names more uniform. Currently you can enter some cities with just their name, no state (if applicable), or country required. This can potentially cause issues if a user types in "Perth" and gets Perth, Scotland rather than their intended Perth, Australia (not sure this is an actual case, but it works for my point).Open Weather has a city database.When entering just a single name and pulling data, it comes with a city ID that corresponds to the one in the city database. The city database also has country and state abbreviations (where applicable) that I could then combine with a database of country names by abbreviation to produce uniform and clear names for the cities. I just need to find a way to access the city database with the id gained from the initial name based fetch. 
