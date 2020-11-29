const getTravelResults = document.addEventListener('DOMContentLoaded', async () => {
    let button = document.getElementById('button');
    let geonamesData = {};
    let apiKey = "";

    button.addEventListener('click', async () => {
        geonamesApi()
        .then(geonamesData =>  weatherbitApi())

        async function geonamesApi() {
            let locationInput = document.getElementById('location').value;
            let url = `http://api.geonames.org/searchJSON?q=${locationInput}&maxRows=1&username=bmg1612`;
            let req = await fetch(url)
            try {
                const data = await req.json();
                geonamesData = {
                    latitude: data.geonames[0].lat,
                    longitude: data.geonames[0].lng
                }    
                return geonamesData;
            } catch(error) {
                Alert("There was an error:", error.message)
            }
        } 
        
        async function weatherbitApi () {
            async function getKey () {
                let req = await fetch ('http://localhost:8081/api');
                try {
                    let data = await req.json();
                    apiKey = data.key;
                    return apiKey;
                } catch (error) {
                    alert("There was an error:", error.message);
                }
            }
            getKey()
            .then (apiKey = async () => {
                let latitude = geonamesData.latitude;
                let longitude = geonamesData.longitude;

                let url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
                let res = await fetch(url);
                try {
                    let apiResponse = await res.json();
                    console.log("::: Response Sent :::");
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