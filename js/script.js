var handleCoords = function(coordsObj) {
	var latitude = coordsObj.coords.latitude,
		longitude = coordsObj.coords.longitude

	var hashString = latitude + '/' + longitude + '/current'

	location.hash = hashString	
	//moved into handleCoords because we still need to make this happen but removing old controller
	document.querySelector(".currentLink").href = "#" + latitude + "/" + longitude + "/" + "current"
	document.querySelector(".dailyLink").href = "#" + latitude + "/" + longitude + "/" + "daily"
	document.querySelector(".hourlyLink").href = "#" + latitude + "/" + longitude + "/" + "hourly"
	document.querySelector(".ninoLink").href = "#" + latitude + "/" + longitude + "/" + "elnino"

}

var handleError = function (err){
	console.log('error!', err)
}

var hideGif = function(){
	var loadRain = document.querySelector('#loadingGif')
	loadRain.style.display = 'none'	
}

var showGif = function(){
	var loadRain = document.querySelector('#loadingGif')
	loadRain.style.display = 'block'	
}


var LatLongRouter = Backbone.Router.extend({
	routes: {
		":lat/:lng/current": "showCurrentWeather",
		":lat/:lng/daily": "showDailyWeather",
		":lat/:lng/hourly": "showHourlyWeather",
		":lat/:lng/elnino": "showElNinoWeather",
		"*default/" : "showGif",
	},

	showCurrentWeather : function(latitude, longitude){
		//moved promises from old if statements into here
		var darkSkyURL = 'https://api.darksky.net/forecast/ee3481b4e29845ee8da6c02efeb4aa88/' + latitude + ',' + longitude + '?callback=?'//putting darksky api in a variable
		var darkSkyPromise = $.getJSON(darkSkyURL) ///actually make api call to darkSkyURL
		darkSkyPromise.then(handleCurrent) //when response comes back send repoObj to handleCurrent
		showGif()
	},

	showDailyWeather : function(latitude, longitude){
		var darkSkyURL = 'https://api.darksky.net/forecast/ee3481b4e29845ee8da6c02efeb4aa88/' + latitude + ',' + longitude + '?callback=?' //putting darksky api in a variable
		var darkSkyPromise = $.getJSON(darkSkyURL) //actually make api call to darkSkyURL
		darkSkyPromise.then(handleDaily) //when response comes back send repoObj to handleDaily
		showGif()
	},

	showHourlyWeather : function(latitude, longitude){
		var darkSkyURL = 'https://api.darksky.net/forecast/ee3481b4e29845ee8da6c02efeb4aa88/' + latitude + ',' + longitude + '?callback=?' //putting darksky api in a variable
		var darkSkyPromise = $.getJSON(darkSkyURL) //actually make api call to darkSkyURL
		darkSkyPromise.then(handleHourly) //when response comes back send repoObj to handleHourly
		showGif()
	},
	showElNinoWeather : function(){
		var weatherContainerNode = document.querySelector('.weatherContainer')
		weatherContainerNode.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/mkSRUf02gu8?rel=0&amp;controls=0&amp;showinfo=0?rel=0&autoplay=1" frameborder="0" allowfullscreen class="elnino"></iframe>'
	}
})

// decides which actions to execute based on whats in the "hash"
// var controller = function() {
// 	var hashString = location.hash.substring(1),
// 		hashParts = hashString.split('/')
// 		latitude = hashParts[0],
// 		longitude = hashParts[1],
// 		weatherType = hashParts[2]


	
	// document.querySelector(".currentLink").href = "#" + latitude + "/" + longitude + "/" + "current"
	// document.querySelector(".dailyLink").href = "#" + latitude + "/" + longitude + "/" + "daily"
	// document.querySelector(".hourlyLink").href = "#" + latitude + "/" + longitude + "/" + "hourly"
	// document.querySelector(".ninoLink").href = "#" + latitude + "/" + longitude + "/" + "elnino"

// 	if (weatherType === 'current'){

// 		var darkSkyURL = 'https://api.darksky.net/forecast/ee3481b4e29845ee8da6c02efeb4aa88/' + latitude + ',' + longitude + '?callback=?'//putting darksky api in a variable
// 		var darkSkyPromise = $.getJSON(darkSkyURL) ///actually make api call to darkSkyURL
// 		darkSkyPromise.then(handleCurrent) //when response comes back send weatherObj to handleCurrent
// 		showGif()
// 	}

// 	else if(weatherType === 'daily') {
// 		var darkSkyURL = 'https://api.darksky.net/forecast/ee3481b4e29845ee8da6c02efeb4aa88/' + latitude + ',' + longitude + '?callback=?' //putting darksky api in a variable
// 		var darkSkyPromise = $.getJSON(darkSkyURL) //actually make api call to darkSkyURL
// 		darkSkyPromise.then(handleDaily) //when response comes back send weatherObj to handleDaily
// 		showGif()
// 	}

// 	else if(weatherType === 'hourly') {
// 		var darkSkyURL = 'https://api.darksky.net/forecast/ee3481b4e29845ee8da6c02efeb4aa88/' + latitude + ',' + longitude + '?callback=?' //putting darksky api in a variable
// 		var darkSkyPromise = $.getJSON(darkSkyURL) //actually make api call to darkSkyURL
// 		darkSkyPromise.then(handleHourly) //when response comes back send weatherObj to handleHourly
// 		showGif()
// 	}

// 	else if(weatherType === 'elnino') {
// 		var weatherContainerNode = document.querySelector('.weatherContainer')
// 		weatherContainerNode.innerHTML = '<img src="http://i.giphy.com/UiksAEg7Qkso0.gif" class="elnino">'
// 	}

// }
// window.addEventListener('hashchange', controller)

var handleCurrent = function(currentWeatherObj) {
	var allCurrentWeatherHTML = ''
	var weatherContainerNode = document.querySelector('.weatherContainer') //grabbing the location of where we want to put current html
		weatherContainerNode.innerHTML = makeCurrentHTML(currentWeatherObj) //convert all makecurrenthtml to string
		hideGif()
}
var handleDaily = function(dailyWeatherObj){
	var weatherContainerNode = document.querySelector('.weatherContainer')
	weatherContainerNode.innerHTML = makeDailyHTML(dailyWeatherObj) //convert all makedailyhtml to string
	hideGif()

}
var handleHourly = function(hourlyWeatherObj){
	var weatherContainerNode = document.querySelector('.weatherContainer')
	weatherContainerNode.innerHTML = makeHourlyHTML(hourlyWeatherObj) //convert all makehourlyhtml to string
	hideGif()
}

var makeCurrentHTML = function(currentObj){ //takes in a single object converts the object into html format
	var getHTML = '' //running total
	getHTML += '<div class="current">' //adding html string to running total
	getHTML += '<div class="currentIcon">' + makeWeatherIcon(currentObj.currently.icon) + '</div>' //adding html string plus pulling api info and adding it to running total
	getHTML += '<div>' + '<h2 class="currentTemperature"> ' + makeInteger(currentObj.currently.temperature) + '&deg;</h2>' + '</div>'
	getHTML += '<div>' + '<p class="currentRainChance">Rain ' + '</br>' + makeInteger((currentObj.currently.precipProbability * 100)) + '&#37;</p>' + '</div>'
	getHTML += '<div>' + '<p class="currentSummary">' + currentObj.daily.summary + '</p>' + '</div>' + '</div>' 
	getHTML += '<div class="column1">'
		getHTML += '<div >' + '<p class="currentFeelsLike">Feels Like' + '</br>' + makeInteger(currentObj.currently.apparentTemperature) + '&deg;</p>' + '</div>'
		getHTML += '<div>' + '<p class="currentVisibility">Visibility' + '</br>' + (currentObj.currently.visibility) + 'mi</p>' + '</div>'
	getHTML	+= '</div>'
	getHTML += '<div class="column2">'
		getHTML += '<div>' + '<p class="currentHumidity">Humidity' + '</br>' + makeInteger((currentObj.currently.humidity) * 100) + '&#37;</p>' + '</div>'
		getHTML += '<div>' + '<p class="currentOzone">Ozone' + '</br>' + (currentObj.currently.ozone) + 'du</p>' + '</div>'
	getHTML += '</div>'
	getHTML += '<div class="column3">'
		getHTML += '<div >' + '<p class="currentWindspeed">Windspeed' + '</br>' + (currentObj.currently.windSpeed) + 'mph</p>' + '</div>'
		getHTML += '<div>' + '<p class="currentPressure">Pressure' + '</br>' + (currentObj.currently.pressure) + 'mb</p>' + '</div>'
	getHTML +='</div>'
	
	return getHTML //return entire running total
}

var makeWeatherIcon = function(darkSkyIconName){
	if (darkSkyIconName === "clear-day") {
		return '<i class="wi wi-day-sunny"></i>'
	}
	if (darkSkyIconName === "clear-night") {
		return '<i class="wi wi-night-clear"></i>'
	}
	if (darkSkyIconName === "rain") {
		return '<i class="wi wi-rain"></i>'
	}
	if (darkSkyIconName === "wind") {
		return '<i class="wi wi-windy"></i>'
	}
	if (darkSkyIconName === "fog") {
		return '<i class="wi wi-fog"></i>'
	}
	if (darkSkyIconName === "cloudy") {
		return '<i class="wi wi-cloudy"></i>'
	}
	if (darkSkyIconName === "partly-cloudy-day") {
		return '<i class="wi wi-day-cloudy"></i>'
	}
	if (darkSkyIconName === "partly-cloudy-night") {
		return '<i class="wi wi-night-cloudy"></i>'
	}
}

var makeDay = function(darkSkyDayTime) {
	var darkSkyDayTime = darkSkyDayTime * 1000
	var formattedDaily = moment(darkSkyDayTime).format('dddd')
	return formattedDaily
}

var makeHour = function(darkSkyHourTime) {
	var darkSkyHourTime = darkSkyHourTime * 1000
	var formattedHourly = moment(darkSkyHourTime).format('h:mm a')
	return formattedHourly
}

var makeInteger = function(darkSkyTempOrRain) {
	var formattedInteger = Math.round((darkSkyTempOrRain * 100) / 100)
	return formattedInteger
}

var makeDailyHTML = function(dailyObj){ //takes in a single object converts the object into html format
	var getDailyHTML = '' //running total
	var dailyArray = dailyObj.daily.data
	for (var index = 1; index < dailyArray.length; index = index + 1){
		getDailyHTML += '<div class="daily">' //adding html string to running total
		getDailyHTML += '<h2 class="dailyTime">' + makeDay(dailyObj.daily.data[index].time) + '</h2>' //adding html string plus pulling api info and adding it to running total
		getDailyHTML += '<h2 class="dailyIcon">' + makeWeatherIcon(dailyObj.daily.data[index].icon) + '</h2>' //adding html string plus pulling api info and adding it to running total
		getDailyHTML += '<h2 class="dailyHigh">High ' + makeInteger(dailyObj.daily.data[index].temperatureMax) + '&deg;</h2>' //adding html string plus pulling api info and adding it to running total
		getDailyHTML += '<h2 class="dailyLow">Low ' + makeInteger(dailyObj.daily.data[index].temperatureMin) + '&deg;</h2>'
		getDailyHTML += '<p class="dailyRain">Rain ' + makeInteger((dailyObj.daily.data[index].precipProbability * 100)) + '&#37;</p>'
		getDailyHTML += '<p class="dailySummary">' + dailyObj.daily.data[index].summary + '</p>'
		getDailyHTML += '</div>'
	}
	return getDailyHTML //return entire running total
}

var makeHourlyHTML = function(hourlyObj){ //takes in a single object converts the object into html format
	var getHourlyHTML = '' //running total
	var hourlyArray = hourlyObj.hourly.data //part of this info is in an array, run through hourly data array
	for (var index = 1; index < hourlyArray.length; index = index + 1) {
		getHourlyHTML += '<div class="hourly">' //adding html string to running total
		getHourlyHTML += '<h2 class="hourlyTime">' + makeHour(hourlyObj.hourly.data[index].time) + '</h2>' //adding html string plus pulling api info and adding it to running total
		getHourlyHTML += '<h2 class="hourlyIcon">' + makeWeatherIcon(hourlyObj.hourly.data[index].icon) + '</h2>' 
		getHourlyHTML += '<p class="hourlyTemperature">' + makeInteger(hourlyObj.hourly.data[index].temperature) + '&deg;</p>' 
		getHourlyHTML += '<p class="hourlyRainChance">Rain ' + makeInteger((hourlyObj.hourly.data[index].precipProbability * 100)) + '&#37;</p>'
		getHourlyHTML += '</div>'
	}
		getHourlyHTML += '<p class="hourlySummary">' + hourlyObj.hourly.summary + '</p>' //add this non array stuff to the stuff we already grabbed
	
	return getHourlyHTML //return entire running total
}

navigator.geolocation.getCurrentPosition(handleCoords,handleError)

var router = new LatLongRouter() 

Backbone.history.start() // this tells backbone to start listening for hashchange events. 


