// search city
// create on click
var cityArray = localStorage.getItem("cityName") ? JSON.parse(localStorage.getItem("cityName")) : []


var apiKey = "605b314b2b469d3d379b6803eeb77b40"


function displayCities() {
    $(".list-group").empty()
    for (let i = 0; i < cityArray.length; i++) {
        var li = $("<li>")
        li.text(cityArray[i])
        li.addClass("list-group-item")
        $(".list-group").append(li)
    }

    $(".list-group-item").on("click",function(){
        var cityName = $(this).text()
        console.log(cityName)
        displayWeather(cityName)
    })

}

displayCities()

function displayWeather(cityName) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey,
        method: "GET"
    }).then(function (currentWeatherData) {
        $("#cityDate").empty()
        console.log(currentWeatherData)

        var iconcode = currentWeatherData.weather[0].icon
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

        //creating image
        var img = $("<img>").attr("src", iconurl)

        $("#cityDate").append(currentWeatherData.name, moment(currentWeatherData.dt, "X").format("(MM/DD/YYYY)"), img)

        //temp
        $("#temp").empty()

        $("#temp").html(" Temp: " + currentWeatherData.main.temp + " F ")

        //humidity
        $("#humid").empty()

        $("#humid").html(" Humidity: " + currentWeatherData.main.humidity)

        $("#wind").empty()

        $("#wind").html(" Wind: " + currentWeatherData.wind.speed)
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentWeatherData.coord.lat + "&lon=" + currentWeatherData.coord.lon + "&exclude=hourly,daily&appid=" + apiKey,
            method: "GET"
        }).then(function (UVData) {
            console.log(UVData)

            $("#uv").empty()
            $("#uv").html(" UV: " + UVData.current.uvi)
        })

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey,

            method: "GET"
        }).then(function (fiveDayData) {
            console.log(fiveDayData)
            var id = 0
            for (let i = 0; i < fiveDayData.list.length; i++) {
                if (fiveDayData.list[i].dt_txt.includes("12:00:00")) {
                    $("#date" + id).empty()
                    $("#date" + id).append(moment(fiveDayData.list[i].dt, "X").format("MM/DD/YYYY"))

                    var iconcode = fiveDayData.list[i].weather[0].icon
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                    $("#image" + id).attr("src", iconurl)

                    $("#temp" + id).empty()
                    $("#temp" + id).html("Temp: " + fiveDayData.list[i].main.temp + " F")

                    $("#humidity" + id).empty()
                    $("#humidity" + id).html("Humidity: " + fiveDayData.list[i].main.humidity)
                    id++
                }
            }




        })

    })


}

$("#searchBtn").on("click", function () {
    var cityName = $("#search").val()

    if (cityArray.join("").includes(cityName) === false) {
        cityArray.push(cityName)
        localStorage.setItem("cityName", JSON.stringify(cityArray))
    }
    displayCities()
    displayWeather(cityName)

})