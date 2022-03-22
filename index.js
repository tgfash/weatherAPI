const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ 6', 'Thứ 7']
const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];



setInterval(() => {
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

const API_KEY = `2e874fa54fac468c859a789cdbd5595c`;

getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let {
            latitude,
            longitude
        } = success.coords;

        fetch(`https:api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

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
        wind_speed
    } = data.current;

     timezone.innerHTML =data.timezone;
     countryEl.innerHTML ="Location : " + data.lat + ' &#176;N /' + data.lon + ' &#176;E'

    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
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
                 <div>${day.weather[0].description}</div>
                 <div class="temp">Day : ${day.temp.day}&#176;C</div>
                 <div class="temp">Night : ${day.temp.night}&#176;C</div>              
             </div>
            
             `
         } else {
             otherDayForcast += `
             <div class="weather-forecast-item">
                 <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                 <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                 <div>${day.weather[0].description}</div>
                 <div class="temp">Day : ${day.temp.day}&#176;C</div>
                 <div class="temp">Night : ${day.temp.night}&#176;C</div>               
             </div>          
             `
         }
     })
     weatherForecastEl.innerHTML = otherDayForcast;
}