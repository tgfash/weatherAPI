const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ 6', 'Thứ 7']
const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];



var x = setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (
        minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

var search = document.querySelector(".txtSearch");

if (search) {
    search.addEventListener('keypress', function (e) {
        if (e.code === 'Space') {
            changeWeatherBySearching()
    
        }
    })
}



const API_KEY = `2e874fa54fac468c859a789cdbd5595c`;

getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let {
            latitude,
            longitude
        } = success.coords;
    
        var myCenter = new google.maps.LatLng(latitude,longitude);
        function initialize() {
            var mapProp = {
                center: myCenter,
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.RoadMAP
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
            var marker = new google.maps.Marker({
                position: myCenter
            });
            marker.setMap(map);
        };
        google.maps.event.addDomListener(window, 'load', initialize);
        
        fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=vi&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);
        })

    })
}

function showWeatherData(data) {
    let {
        humidity,
        pressure,
        sunrise,
        sunset,
        wind_speed,
        temp
    } = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = "Location : " + data.lat + ' , ' + data.lon 


    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
        <div>Nhiệt độ hiện tại</div>
        <div>${temp} &#176;C</div>
    </div>
        <div class="weather-item">
        <div>Độ ẩm</div>
        <div>${humidity} %</div>
    </div>
    <div class="weather-item">
        <div>Áp suất</div>
        <div>${pressure} Pa</div>
    </div>
    <div class="weather-item">
        <div>Tốc độ gió</div>
        <div>${wind_speed} m/s</div>
    </div>
     <div class="weather-item">
         <div>Bình minh</div>
         <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
     </div>
     <div class="weather-item">
         <div>Hoàng hôn</div>
         <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
     </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
             <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon" class="w-icon">             
             <div class="other">            
                 <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                 <div>Thời tiết dự báo : ${day.weather[0].description}</div>
                 <div class="temp">Nhiệt độ ban ngày :<br> ${day.temp.day}&#176;C</div>
                 <div class="temp">Nhiệt độ ban đêm :<br> ${day.temp.night}&#176;C</div>              
             </div>
            
             `
        } else {
            otherDayForcast += `
             <div class="weather-forecast-item">
                 <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                 <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                 <div>Thời tiết dự báo : ${day.weather[0].description}</div>
                 <div class="temp">Nhiệt độ ban ngày :<br> ${day.temp.day}&#176;C</div>
                 <div class="temp">Nhiệt độ ban đêm :<br> ${day.temp.night}&#176;C</div>               
             </div>          
             `
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
}

function changeWeatherBySearching() {
    let capitalSearch = search.value.trim();

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${capitalSearch}&appid=${API_KEY}`).then(res => res.json()).then(data2 => {
        console.log(data2);
        showWeatherData2(data2)
    });
}

function showWeatherData2(data2) {
    let {
        humidity,
        pressure
    } = data2.main;
    let {
        sunrise,
        sunset
    } = data2.sys;
    let temp = Math.round((data2.main.temp - 273.15) * 100) / 100;
    let wind_speed = data2.wind.speed;
    let latitude2 = data2.coord.lat;
    let longitude2 = data2.coord.lon;

    var myCenter = new google.maps.LatLng(latitude2,longitude2);
    function initialize2() {
        var mapProp = {
            center: myCenter,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.RoadMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        var marker = new google.maps.Marker({
            position: myCenter
        });
        marker.setMap(map);
    };
    google.maps.event.addDomListener(window, 'dblclick', initialize2);
   
    timezone.innerHTML = data2.name + ' , ' + data2.sys.country;
    countryEl.innerHTML = "Location : " + latitude2 + ' , ' + longitude2 
    if (temp < 25 && temp >= 17) {
        document.body.style.backgroundImage = "url('img/warm.png')";
        document.body.style.backgroundSize = "cover"
    } else if (temp < 17 && temp >= 10) {
        document.body.style.backgroundImage = "url('img/cool.png')";
        document.body.style.backgroundSize = "cover"
    } else if (temp < 10) {
        document.body.style.backgroundImage = "url('img/cold.png')";
        document.body.style.backgroundSize = "cover";
    } else if (temp > 25) {
        document.body.style.backgroundImage = "url('img/hot.png')";
        document.body.style.backgroundSize = "cover";
    }
    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
        <div>Nhiệt độ hiện tại</div>
        <div>${temp} &#176;C</div>
    </div>  
        <div class="weather-item">
           <div>Độ ẩm</div>
           <div>${humidity} %</div>
       </div>
       <div class="weather-item">
           <div>Áp suất</div>
           <div>${pressure} Pa</div>
       </div>
       <div class="weather-item">
           <div>Tốc độ gió</div>
           <div>${wind_speed} m/s</div>
       </div>
        <div class="weather-item">
            <div>Bình minh</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Hoàng hôn</div>
            <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
        </div>       
       `;

    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${latitude2}&lon=${longitude2}&lang=vi&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data3 => {
        console.log(data3)
        clearInterval(x);
        let timezone = data3.timezone;
       
        var today = new Date().toLocaleString("en-US", {
            timeZone: timezone
        });
        today = new Date(today);
        const month = today.getMonth();
        const date = today.getDate();
        const day = today.getDay();
        const hour = today.getHours();
        const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
        const minutes = today.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM'

        timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (
            minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

        dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

        let otherDayForcast = ''
        data3.daily.forEach((day, idx) => {
            if (idx == 0) {
                currentTempEl.innerHTML = `
                 <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon" class="w-icon">             
                 <div class="other">            
                     <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                     <div>Thời tiết dự báo : ${day.weather[0].description}</div>
                     <div class="temp">Nhiệt độ ban ngày :<br> ${day.temp.day}&#176;C</div>
                     <div class="temp">Nhiệt độ ban đêm :<br>${day.temp.night}&#176;C</div>              
                 </div>
                
                 `
            } else {
                otherDayForcast += `
                 <div class="weather-forecast-item">
                     <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                     <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                     <div>Thời tiết dự báo : ${day.weather[0].description}</div>
                     <div class="temp">Nhiệt độ ban ngày :<br> ${day.temp.day}&#176;C</div>
                     <div class="temp">Nhiệt độ ban đêm :<br> ${day.temp.night}&#176;C</div>               
                 </div>          
                 `
            }
        })
        weatherForecastEl.innerHTML = otherDayForcast;
    })
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  
var countries = ["Ha Noi","Ho Chi Minh","Bac Ninh","New York","Tokyo","Beijing","Osaka","Toronto","Jakarta","Manila"];

autocomplete(document.getElementById("searchTextField"), countries);
