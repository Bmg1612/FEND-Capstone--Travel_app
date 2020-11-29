const getTravelResults = document.addEventListener('DOMContentLoaded', async () => {
    let button = document.getElementById('button');
    // Initializing empty object to retrieve geonames data
    let geonamesData = {};
    //Initializing empty string for the API keys fetched from the server
    let apiKey = "";
    
    button.addEventListener('click', async () => {
        let locationInput = document.getElementById('location').value;

        // Initializing empty objects to retrieve API data
        let apiResponse = {};
        let weatherResponse = {};

        
        // Main function
        geonamesApi()
        .then(geonamesData =>  weatherbitApi())
        .then(weatherResponse =>   postData('/addText', {
                city_name: weatherResponse.city_name,
                country_code: weatherResponse.country_code,
                temp: weatherResponse.temp,
                app_temp: weatherResponse.app_temp,
                description: weatherResponse.weather.description
            })
        )    
        .then(pixabayApi())

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
                //Fetching data
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
            async function getPhotoKey () {
                let req = await fetch ('http://localhost:8081/api');
                try {
                    let data = await req.json();
                    apiKey = data.photoKey;
                    ("::: Got the key of Pixabay API :::")
                    return apiKey;
                } catch (error) {
                    alert("There was an error:", error.message);
                }
            }

            getPhotoKey()
            .then (apiKey = async () => {
                let url = `https://pixabay.com/api/?key=${apiKey}&q=${locationInput}&image_type=photo`;
                console.log(url)
                let res = await fetch(url);
                try {
                    let photoResponse = await res.json();
                    console.log("::: Fetched data from Pixabay API :::");
                    console.log(photoResponse)
                    return photoResponse;
                } catch (error) {
                    alert("There was an error:", error.message);
                }
            })
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
                let newData = await res.json();
                console.log(newData);
                return newData
            } catch(error) {
                alert("There was an error:", error.message);
            }
        }

    })
});    

export { getTravelResults }