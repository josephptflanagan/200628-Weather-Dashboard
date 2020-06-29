# 200628 Weather Dashboard

## GitHub Repository URL
https://github.com/josephptflanagan/200628-Weather-Dashboard

## Site URL
https://josephptflanagan.github.io/200628-Weather-Dashboard/

## Screenshot

### How it Works
First Time Users of the site are welcomed by a header and a searchbar. Once they type a city name into the search bar and hit the search button the name is sent to the getWeatherData function that accesses the relavent data within the Open Weather Database. This data is used to contruct a cityDataOject. The cityDataObject is then added to the cities array and saved to local storage, after which it is sent to the display function which calls all three separate display functions (city cards, current day forecast, 5 day forecast). 

When citybuttons are pressed, they call for the display of their weather data.

When the deletebuttons are pressed, the delete their button and remove the content from the save data.

When data is loaded from the localStorage, it sends the name of the city up to search for new data. When this happens, new data is gathered, a new object is created, and when this object is found to have the same name as an existing dataobject, that old object is overwritten by the new one. Objects are then pressed into the display function. 