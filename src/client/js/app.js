const getTravelResults = document.addEventListener(
  "DOMContentLoaded",
  async () => {
    const form = document.querySelector(".form");
    // Initializing empty string for the API keys fetched from the server
    let apiKey = "";
    // Event Listener
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const locationInput = document.getElementById("location").value;
      // Date input values
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Converted start date to calculate countdown
      const convertedStartDate = new Date(startDate);
      const convertedEndDate = new Date(endDate);

      // Creating new date objects to simulate today, next week and 16 days from now
      // Each one will call a certain part of the weatherbit API
      // Today will be used to calculate countdown too
      let today = new Date();
      let nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      let twoWeeksFromNow = new Date(
        today.getTime() + 16 * 24 * 60 * 60 * 1000
      );

      // Calculating the length of the trip
      const diffTimeTrip = Math.abs(convertedEndDate - convertedStartDate);
      const diffDaysTrip = Math.ceil(diffTimeTrip / (1000 * 60 * 60 * 24));

      // Calculating the difference in days between today and the start date
      const diffTimeCountdown = Math.abs(convertedStartDate - today);
      const diffDaysCountdown = Math.ceil(
        diffTimeCountdown / (1000 * 60 * 60 * 24)
      );

      // Initializing empty objects to retrieve API data
      let geonamesData = {};
      let apiResponse = {};
      let weatherResponse = {};
      let photoResponse = {};
      let newData = {};

      /* 
      MAIN FUNCTION
      */
      geonamesApi()
        .then((geonamesData) => weatherbitApi())
        .then((weatherResponse) => pixabayApi())
        .then((photoResponse) =>
          postData("/addText", {
            city_name: weatherResponse.city_name,
            country_code: weatherResponse.country_code,
            temp: weatherResponse.temp,
            app_temp: weatherResponse.app_temp,
            description: weatherResponse.weather.description,
            photo: photoResponse,
          })
        )
        .then((newData) => updateUI());

      /* 
        API FUNCTIONS
        */
      async function geonamesApi() {
        const url = `http://api.geonames.org/searchJSON?q=${locationInput}&maxRows=1&username=bmg1612`;
        const req = await fetch(url);
        try {
          const data = await req.json();
          geonamesData = {
            latitude: data.geonames[0].lat,
            longitude: data.geonames[0].lng,
          };
          console.log("::: Fetched data from Geonames API :::");
          return geonamesData;
        } catch (error) {
          alert("There was an error:", error.message);
        }
      }
      async function weatherbitApi() {
        // Date input values transformed to last year
        // For the case someone searches for a date after
        // 16 days from now, which will be covered by
        // historical fetch from weatherbit API
        let lastYearStartDate = new Date(startDate);
        let lastYearEndDate = new Date(endDate);
        lastYearStartDate.setMonth(lastYearStartDate.getMonth() - 12);
        lastYearEndDate.setMonth(lastYearEndDate.getMonth() - 12);

        // Helper function to change the format from Date object to regular date
        // As in 'Tue Dec 24 2019 21:00:00 GMT-0300' to => 2019-12-24
        const changeFormat = (date = "") => {
          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
          const yyyy = date.getFullYear();
          date = `${yyyy}-${mm}-${dd}`;
          return date;
        };

        // Changing the format
        lastYearStartDate = changeFormat(lastYearStartDate);
        lastYearEndDate = changeFormat(lastYearEndDate);

        // Formatting today's date
        today = changeFormat(today);
        // Formatting next weeks's date
        nextWeek = changeFormat(nextWeek);
        // Formatting 16 days from now
        twoWeeksFromNow = changeFormat(twoWeeksFromNow);

        const latitude = geonamesData.latitude;
        const longitude = geonamesData.longitude;

        // Getting API key from the server
        const req = await fetch("http://localhost:8081/api");
        try {
          const data = await req.json();
          apiKey = data.weatherKey;
          console.log("::: Got the key of Weatherbit API :::");
          // Fetching data

          // If the trip between next week and 16 days
          if (startDate > nextWeek && startDate <= twoWeeksFromNow) {
            const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
            const res = await fetch(url);
            apiResponse = await res.json();
            console.log("::: Fetched data from Weatherbit API :::");
            // Creating the object manually because the disposition of the response object is different
            weatherResponse = {
              city_name: apiResponse.city_name,
              country_code: apiResponse.country_code,
              // Getting the array n. 8 because it is on the middle of 16
              temp: apiResponse.data[8].temp,
              app_temp: (
                (apiResponse.data[8].app_max_temp +
                  // eslint-disable-next-line prettier/prettier
                  apiResponse.data[10].app_min_temp) / 2
              ).toFixed(1),
              weather: {
                description: apiResponse.data[8].weather.description,
              },
            };
            return weatherResponse;
            // In case the trip is after 16 days from now
            // In this case, this API limits to one request per day in the free version
          } else if (startDate > twoWeeksFromNow) {
            const url = `https://api.weatherbit.io/v2.0/history/hourly?lat=${latitude}&lon=${longitude}&start_date=${lastYearStartDate}&end_date=${lastYearEndDate}&key=${apiKey}`;
            const res = await fetch(url);
            apiResponse = await res.json();
            console.log("::: Fetched data from Weatherbit API :::");
            console.log(apiResponse);
            // Creating the object manually because the disposition of the response object is different
            weatherResponse = {
              city_name: apiResponse.city_name,
              country_code: apiResponse.country_code,
              // Getting the array n. 8 because it is on the middle of 16
              temp: apiResponse.data.temp,
              // Simulating apparent temperature, since it is not given in this response
              app_temp: apiResponse.data.app_temp,
              weather: {
                description: apiResponse.data[8].weather.description,
              },
            };
            console.log(weatherResponse);
            return weatherResponse;
            // If the trip is this week
          } else {
            const url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
            const res = await fetch(url);
            apiResponse = await res.json();
            console.log("::: Fetched data from Weatherbit API :::");
            weatherResponse = apiResponse.data[0];
            return weatherResponse;
          }
        } catch (error) {
          alert("There was an error:", error.message);
        }
      }
      async function pixabayApi() {
        // Getting API key from the server
        const req = await fetch("http://localhost:8081/api");
        try {
          const data = await req.json();
          apiKey = data.photoKey;
          console.log("::: Got the key of Pixabay API :::");
          // Fetching data
          const url = `https://pixabay.com/api/?key=${apiKey}&q=${weatherResponse.city_name}&image_type=photo`;
          const res = await fetch(url);
          apiResponse = await res.json();
          console.log("::: Fetched data from Pixabay API :::");
          // If it is a big city, there will be 20 'hits' photos
          // Then it will be randomly chosen
          if (apiResponse.hits.length === 20) {
            photoResponse =
              apiResponse.hits[Math.floor(Math.random() * 21)].webformatURL;
            return photoResponse;
            // If it is a smaller city with less than 20 hits
            // The first one is chosen
          } else {
            photoResponse = apiResponse.hits[0].webformatURL;
            return photoResponse;
          }
        } catch (error) {
          alert("There was an error:", error.message);
        }
      }

      async function postData(url = "", data = {}) {
        const res = await fetch(url, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        try {
          newData = await res.json();
          console.log(newData);
          return newData;
        } catch (error) {
          alert("There was an error:", error.message);
        }
      }

      /* 
        FUNCTION TO UPDATE UI
      */
      async function updateUI() {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = `
        <h2>Your trip to ${newData.city_name}</h2>
        <div class="results__image">
          <img src="${newData.photo}" alt="Photo of ${
          newData.city_name
        } from Pixabay">     
        </div>;  
        <div class="results__text">
          <p>Typically, the weather for ${newData.city_name}/
          ${newData.country_code} on the desired  date is ${
          newData.temperature
        }ºC with ${newData.description.toLowerCase()} and apparent temperature of ${
          newData.app_temp
        }ºC.
          </p>
          <p><a href="https://www.weatherbit.io/" target="_blank">Source</a></p>
          <br>
          <p>Countdown: In ${diffDaysCountdown} days you will be in ${
          newData.city_name
        }! You will stay there for ${diffDaysTrip} days!</p>
        </div>`;
        resultsDiv.style.display = "grid";
        resultsDiv.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
);

export { getTravelResults };
