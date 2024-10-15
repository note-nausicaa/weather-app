
function enterWeather() {
    const form = document.querySelector('.weather');
    const location = document.getElementById('location');
    const info = document.querySelector('.info')

    const reset = () => {
        const infoChildren = info.childNodes;
        for (child of infoChildren) {
            if (child.hasChildNodes()) {
                let grandChildren = child.childNodes; {
                    for( const grandchild of grandChildren) {
                        grandchild.textContent = '';
                    }
                }
            }
            else if (!child.hasChildNodes()) {
                child.textContent = '';
            }
        }
    }

    form.addEventListener('submit', (e) => {

        // console.log(`Submitted ${location.value}`)
        // let thisLocation = location.value;

        // if (radioMetric.checked) {
        //      displayWeather(thisLocation, radioMetric.value);
        //      e.preventDefault()
        // }
        // else if (radioFaren.checked) {
        //     displayWeather(thisLocation, radioFaren.value);
        //     e.preventDefault()
        // }

        let output = "";
        reset();

        let data = new FormData(form)

        for (const entry of data){
            output = `${entry[1]}`
            displayWeather(location.value, output)
        }
        e.preventDefault();
        
    })
}


async function getWeather(location, unit) {
    
    let currentWeather = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+`${location}`+'?unitGroup='+`${unit}`+'&key=AA8G8YBZUXAHUGAL9HY3SXUWX', {mode: 'cors'});
    let weatherData = await currentWeather.json();

    console.log(weatherData)

    function weatherObj(location, date, unit, description, condition, icon, precipitation, temperature, feelsLike, humidity, uvIndex) {
        this.location = location;
        this.date = date;
        this.unit = unit;
        this.description = description;
        this.condition = condition;
        this.icon = icon;
        this.precipitation = precipitation;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.uvIndex = uvIndex;
    }

    const weather = new weatherObj(location, 
        new Date(), 
        unit, 
        weatherData.description, 
        weatherData.currentConditions.conditions, weatherData.currentConditions.icon, 
        weatherData.currentConditions.precip, 
        weatherData.currentConditions.temp, 
        weatherData.currentConditions.feelslike, weatherData.currentConditions.humidity, 
        weatherData.currentConditions.uvindex);

    return weather;

}

async function displayWeather(location, unit) {

    const weatherObj = await getWeather(location, unit);

    const locationDiv = document.getElementById('location-div');
    const dateDiv = document.getElementById('date');
    const temperature = document.getElementById('temperature');
    
    const humidityDiv = document.getElementById('humidity-div');
    const humidityLabel = document.createElement('span')
    const humidity = document.createElement('h2')
    humidityLabel.textContent = 'Humidity'

    humidityDiv.appendChild(humidityLabel)
    humidityDiv.appendChild(humidity)

    const feelsLikeDiv = document.getElementById('feels-div');
    const feelsLikeLabel = document.createElement('span');
    const feelsLike = document.createElement('h2')

    feelsLikeLabel.textContent = 'Feels like: '
    feelsLikeDiv.appendChild(feelsLikeLabel);
    feelsLikeDiv.appendChild(feelsLike)

    
    const uvDiv = document.getElementById('uv-div');
    const uvTitle = document.createElement('span');
    const uv = document.createElement('h2')

    uvTitle.textContent = 'UV Index';

    uvDiv.appendChild(uvTitle)
    uvDiv.appendChild(uv)

    const description = document.getElementById('description');

    const tempImage = document.getElementById('temperature-image');

    const condition = document.getElementById('condition');
    
    const precipitationDiv = document.getElementById('precipitation-div');
    const precipLabel = document.createElement('span')
    const precipitation = document.createElement('h2')

    precipLabel.textContent = 'Precipitation'

    precipitationDiv.appendChild(precipLabel)
    precipitationDiv.appendChild(precipitation)

    locationDiv.textContent = weatherObj.location;
    dateDiv.textContent = weatherObj.date;

    temperature.textContent = weatherObj.temperature;
    humidity.textContent = weatherObj.humidity;
    feelsLike.textContent = weatherObj.feelsLike;
    uv.textContent = weatherObj.uvIndex;
    precipitation.textContent = weatherObj.precipitation;
   
    description.textContent = weatherObj.description;
    condition.textContent = weatherObj.condition;

    tempImage.src = `./images/${weatherObj.icon}.svg`


    const checkTemp = () => {
        if (weatherObj.temperature > 24) {
            temperature.style.color = 'orange';
        }
        else if (weatherObj.temperature < 23) {
            temperature.style.color = 'blue';
        }
    }

    checkTemp();
}

enterWeather();

