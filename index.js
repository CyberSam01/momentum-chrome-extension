const imgLocation = document.getElementById("location")
const crypto = document.getElementById("crypto")
const cryptoContainer = document.getElementById("crypto-container")
const weatherContainer = document.getElementById("weather-container")
const time = document.getElementById("time")
const quoteTitle = document.getElementById("quote-title")
const quoteAuthor = document.getElementById("quote-author")
const greet = document.getElementById("greet")

const date = new Date()

let person = "Sam"
let latitude = ""
let longitude = ""
let chosenCoin = "dogecoin"

const unsplashUrl = "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature"
const coinGekkoUrl = `https://api.coingecko.com/api/v3/coins/${chosenCoin}`

async function getImg() {
    try {
        const imgRes = await fetch(unsplashUrl)
        const imgData = await(imgRes.json())
        document.body.style.backgroundImage = `url(${imgData.urls.full})`
        if (imgData.location.name == null) {
            imgLocation.innerText = ""
        } else {
            imgLocation.innerText = `Location: ${imgData.location.name}`
        }
        
    } catch(err){
        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTU4MDIzNDI&ixlib=rb-1.2.1&q=80")`
        console.log(err);
    }
}

async function getCoins() {
    try {
        const coinRes = await fetch(coinGekkoUrl,{
            headers: {
                "Content-Type": "application/json",
                "mode":'no-cors' 
            } 
        })
        const coinData = await(coinRes.json())
        cryptoContainer.innerHTML = `
                    <img id="coin-img" src="${coinData.image.large}" alt="${coinData.localization.en}">
                    <div id="crypto-text">
                        <div id="crypto-name-price">
                            <h3 class="coin-name" id="crypto">${coinData.name}</h3> 
                            <h3 class="coin-price" id="crypto">$ ${coinData.market_data.current_price.usd}</h3>
                        </div>
                        <div id="crypto-high-low">
                            <h3 class="coin-high">👆 $ ${coinData.market_data.high_24h.usd}</h3>
                            <h3 class="coin-low">👇 $ ${coinData.market_data.low_24h.usd}</h3>
                        </div>
                    </div>
                    `

    
        console.log(coinData);   
    }
    catch(err) {
        cryptoContainer.innerHTML = ``
        throw Error("Something went wrong")
     }       
}

function getTime() {
    time.innerText = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

function getGreeting() { 
    if (date.getHours() >= 5 && date.getHours() < 12) {
        greet.innerText = `Good Morning ${person}`
    } else if (date.getHours() >= 12 && date.getHours() < 17) {
        greet.innerText = `Good Afternoon ${person}`
    } else if (date.getHours() >= 17 && date.getHours() < 21) {
        greet.innerText = `Good Evening ${person}`
    } else {
        greet.innerText = `Good Night ${person}`
    }
}


async function getQuote() {
    const quoteRes = await fetch("https://api.goprogram.ai/inspiration")
    const quoteData = await quoteRes.json()
    // console.log(quoteData.quote);
    quoteTitle.innerText = quoteData.quote
    quoteAuthor.innerText = quoteData.author
}

navigator.geolocation.getCurrentPosition(async(position) => {
    try {
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3efb4617aab1f90d815741ba508ca55f`
        const weatherRes = await fetch(weatherUrl)
        if (!weatherRes.ok) {
            throw Error("Weather data not available")
        } else {
            const weatherData = await weatherRes.json()
            console.log(weatherData);
            let temp = Math.round(weatherData.main.temp)
            weatherContainer.innerHTML = `
                        <h3>${weatherData.name}</h3>
                        <div id="temp-div">
                            <img id="weather-img" src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="">
                            <h3>${temp} °C</h3>
                        </div>
                        `
        }
    } catch(err) {
        cryptoContainer.innerHTML = ``
        throw Error("Something went wrong with the weather API")
     }   
})

getImg()
getCoins()
setInterval(getTime, 1000)
getQuote()
setInterval(getGreeting, 1000)


  




