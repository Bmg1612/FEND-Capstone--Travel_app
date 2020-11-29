const getTravelResults = document.addEventListener('DOMContentLoaded', async () => {
    let button = document.getElementById('button');
    // Initializing empty object to retrieve geonames data
    let geonamesData = {};
    //Initializing empty string for the API keys fetched from the server
    let apiKey = "";

    button.addEventListener('click', async () => {
        let locationInput = document.getElementById('location').value;
        
        // Main function
        geonamesApi()
        .then(geonamesData =>  weatherbitApi())
        .then(apiResponse => pixabayApi())

        async function geonamesApi() {
            let url = `http://api.geonames.org/searchJSON?q=${locationInput}&maxRows=1&username=bmg1612`;
            console.log(url)
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
            // Getting API key from the server
            async function getWeatherKey () {
                let req = await fetch ('http://localhost:8081/api');
                try {
                    let data = await req.json();
                    apiKey = data.weatherKey;
                    console.log("::: Got the key of Weatherbit API :::")
                    return apiKey;
                } catch (error) {
                    alert("There was an error:", error.message);
                }
            }

            getWeatherKey()
            .then (apiKey = async () => {
                let latitude = geonamesData.latitude;
                let longitude = geonamesData.longitude;

                let url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
                console.log(url)
                let res = await fetch(url);
                try {
                    let apiResponse = await res.json();
                    console.log("::: Fetched data from Weatherbit API :::");
                    console.log(apiResponse)
                    return apiResponse;
                } catch (error) {
                    alert("There was an error:", error.message);
                }
            })
            
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
                    let apiResponse = await res.json();
                    console.log("::: Fetched data from Pixabay API :::");
                    console.log(apiResponse)
                    return apiResponse;
                } catch (error) {
                    alert("There was an error:", error.message);
                }
            })
        }
    })
});    

export { getTravelResults }