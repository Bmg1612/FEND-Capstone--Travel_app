const getTravelResults = document.addEventListener('DOMContentLoaded', async () => {
    let button = document.getElementById('button');

    button.addEventListener('click', async () => {
        geonamesApi()
        // .then (geonamesData => )

        async function geonamesApi() {
            let locationInput = document.getElementById('location').value;
            let url = `http://api.geonames.org/searchJSON?q=${locationInput}&maxRows=1&username=bmg1612`;
            let req = await fetch(url)
            try {
                const data = await req.json();
                let geonamesData = {
                    latitude: data.geonames[0].lat,
                    longitude: data.geonames[0].lng
                }    
                return geonamesData;
            } catch(error) {
                Alert("There was an error:", error.message)
            }

        }  
    })
});    

export { getTravelResults }