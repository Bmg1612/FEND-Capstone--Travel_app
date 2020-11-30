const getTravelResults = document.addEventListener('DOMContentLoaded', async () => {
    let button = document.getElementById('button');
    
    //Initializing empty string for the API keys fetched from the server
    let apiKey = "";
    
    button.addEventListener('click', async () => {
        let locationInput = document.getElementById('location').value;

        // Initializing empty objects to retrieve API data
        let geonamesData = {};
        let apiResponse = {};
        let weatherResponse = {};
        let photoResponse = {};
        let newData = {};

        
        // Main function
        geonamesApi()
        .then(geonamesData =>  weatherbitApi())
        .then(weatherResponse => pixabayApi())
        .then(photoResponse =>   postData('/addText', {
                city_name: weatherResponse.city_name,
                country_code: weatherResponse.country_code,
                temp: weatherResponse.temp,
                app_temp: weatherResponse.app_temp,
                description: weatherResponse.weather.description,
                photo: photoResponse
            })
        )
        .then(newData => updateUI());

        async function geonamesApi() {
            let url = `http://api.geonames.org/searchJSON?q=${locationInput}&maxRows=1&username=bmg1612`;
            let req = await fetch(url)
            try {
                let data = await req.json();
                geonamesData = {
                    latitude: data.geonames[0].lat,
                    longitude: data.geonames[0].lng
                }
                console.log("::: Fetched data from Geonames API :::")    
                return geonamesData;
            } catch(error) {
                Alert("There was an error:", error.message)
            }
        } 
        
        async function weatherbitApi () {
            let latitude = geonamesData.latitude;
            let longitude = geonamesData.longitude;

            // Getting API key from the server
            let req = await fetch ('http://localhost:8081/api');
            try {
                let data = await req.json();
                apiKey = data.weatherKey;
                console.log("::: Got the key of Weatherbit API :::")
                // Fetching data
                let url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
                let res = await fetch(url);
                apiResponse = await res.json();
                console.log("::: Fetched data from Weatherbit API :::");
                weatherResponse = apiResponse.data[0];
                return weatherResponse;
            } catch (error) {
                alert("There was an error:", error.message);
            }
        }

        async function pixabayApi () {
            // Getting API key from the server
            let req = await fetch ('http://localhost:8081/api');
            try {
                let data = await req.json();
                apiKey = data.photoKey;
                console.log("::: Got the key of Pixabay API :::")
                // Fetching data
                let url = `https://pixabay.com/api/?key=${apiKey}&q=${weatherResponse.city_name}&image_type=photo`;
                let res = await fetch(url);
                apiResponse = await res.json();
                console.log("::: Fetched data from Pixabay API :::");
                console.log(apiResponse);
                // If it is a big city, there will be 20 'hits' photos
                // Then it will be randomly chosen
                if (apiResponse.hits.length === 20) {
                    photoResponse = apiResponse.hits[Math.floor(Math.random() * 21)].webformatURL;
                    console.log(photoResponse)
                    return photoResponse;
                // If it is a smaller city with less than 20 hits
                // The first one is chosen    
                } else {
                    photoResponse = apiResponse.hits[0].webformatURL;
                    console.log(photoResponse)
                    return photoResponse;
                }
            } catch (error) {
                alert("There was an error:", error.message);
            }
        }

        async function postData (url = '', data = {}) {
            let res = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            try {
                newData = await res.json();
                console.log(newData);
                return newData
            } catch(error) {
                alert("There was an error:", error.message);
            }
        }

        async function updateUI () {
            let resultsDiv = document.getElementById('results');
            let resultsImage = document.querySelector('.results__image');
            let resultsText = document.querySelector('.results__text');

            resultsImage.innerHTML = `<img src="${newData.photo}" alt="Photo of ${newData.city_name} from Pixabay">`;
            resultsText.innerHTML = `<p>The weather for ${newData.city_name}/${newData.country_code} on the desired  date is going to be ${newData.temperature}ºC with ${newData.description.toLowerCase()} and apparent temperature of ${newData.app_temp}ºC.</p>
            <p><a href="https://www.weatherbit.io/" target="_blank">Source</a></p>`;
            resultsDiv.style.display = "grid";                        
            resultsDiv.scrollIntoView({behavior: "smooth"});

        }

    })
});    

export { getTravelResults }