// console.log('chaliye shuru karte hain');

// let API_KEY = "d6182d6fe6c7f99310e5d1cc9b83a2bb" ;

// async function fetchWeatherDetails() {
//     let city = "Barshi";

//     let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     let data = await response.text;

//     console.log("weather data -> " , data) ;

//     let newPara = document.createElement("p") ;
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} C`;

//     document.body.appendChild(newPara);
// }


let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]") ;
let grantAccessContainer = document.querySelector(".grant-location-container") ;
let searchForm = document.querySelector("[data-searchForm]") ;
let loadingScreen = document.querySelector(".loading-container") ;
let userInfoContainer = document.querySelector(".user-info-container") ;

// initally required variables
let currentTab = userTab ;
currentTab.classList.add("current-tab") ;
const API_KEY = "d6182d6fe6c7f99310e5d1cc9b83a2bb" ;
getfromSessionStorage() ;


function switchTab(clickedTab) {
    if(currentTab !== clickedTab) {
        currentTab.classList.remove("current-tab") ;
        currentTab = clickedTab ;
        currentTab.classList.add("current-tab") ;

        if(!searchForm.classList.contains("active")) {
            searchForm.classList.add("active");
            grantAccessContainer.classList.remove("active") ;
            userInfoContainer.classList.remove("active");
        } else {
            searchForm.classList.remove("active") ;
            userInfoContainer.classList.remove("active");
            cityError.classList.remove("active") ;
            cityErrorPara.innerText = "" ;
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab) ;
})

searchTab.addEventListener('click', () => {
    switchTab(searchTab) ;
})

// check if coordinates are already presetn in session 
function  getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates") ;

    if(!localCoordinates) {
        grantAccessContainer.classList.add("active") ;
    } else {
        let coordinates = JSON.parse(localCoordinates) ;
        fetchUserWeatherInfo(coordinates) ;
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates ;
    
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active") ;

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) ;

        let data = await response.json() ;

        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        userInfoContainer.classList.remove("top-margin") ; 
        renderWeatherInfo(data) ;
    } 
    catch(err) {
        loadingScreen.classList.remove("active") ;
        console.log("error aye hain bhai") ;
    }
}

let cityError = document.querySelector("[data-notFoundCity]") ;
let cityErrorPara = document.querySelector("[data-notFoundCityPara]") ;

function renderWeatherInfo(weatherInfo) {
    
    //initially fetching elements
    let cityName = document.querySelector("[data-cityName]") ;
    let countryIcon = document.querySelector("[data-countryIcon]") ;
    let desc = document.querySelector("[data-weatherDesc]") ;
    let weatherIcon = document.querySelector("[data-weatherIcon]") ;
    let temp = document.querySelector("[data-temp]") ;
    let windspeed = document.querySelector("[data-windspeed]") ;
    let humidity = document.querySelector("[data-humidity]") ;
    let cloudiness = document.querySelector("[data-cloudiness]") ;
    let code = weatherInfo?.cod ;
    let errorCode = 404 ;
    // console.log(code);

    if(code == errorCode) {
        userInfoContainer.classList.remove("active") ;
        cityError.classList.add("active") ;
        cityErrorPara.innerText = weatherInfo?.message ;
    } 
    else {
        cityName.innerText = weatherInfo?.name ;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png` ;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;   
        windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    } 
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition) ;
    } else {
        alert('Geolocation is not supported') ;
    }
}

function showPosition(position) {

    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates)) ; 
    fetchUserWeatherInfo(usercoordinates);  
}

let grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation)


let searchInput = document.querySelector("[data-searchInput]") ;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault() ;
    let cityName = searchInput.value ;

    if(cityName === "") {
        // return ;
        alert('Please enter the city') ;
    } else {
        fetchSearchWeatherInfo(cityName) ;
    }
    searchInput.value = "";
})

async function fetchSearchWeatherInfo(city) {
    userInfoContainer.classList.remove("active");
    loadingScreen.classList.add("active") ;

    // loadingScreen.classList.add("active");
    // userInfoContainer.classList.remove("active");
    // grantAccessContainer.classList.remove("active");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`) ;
        let data = await response.json() ;
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        userInfoContainer.classList.add("top-margin") ; 
        renderWeatherInfo(data) ;


    } catch (err) {
        // console.log('error aye hain') ;
    }
}