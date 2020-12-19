import {
  storageAvailable,
  saveTripData,
  preFillTripData,
  preFillToDoData,
} from './localStorage';

const getTravelResults = document.addEventListener(
  'DOMContentLoaded',
  async () => {
    const model = {
      input: {
        location: null,
        startDate: null,
        endDate: null,
      },
      dates: {
        today: null,
        nextWeek: null,
        twoWeeksFromNow: null,
        lastYearStartDate: null,
        lastYearEndDate: null,
        convertedToday: null,
        convertedStartDate: null,
        convertedEndDate: null,
        diffTimeTrip: null,
        diffDaysTrip: null,
        diffTimeCountdown: null,
        diffDaysCountdown: null,
      },
      apiObjects: {
        geonamesData: {},
        apiResponse: {},
        weatherResponse: {},
        photoResponse: {},
        newData: {},
      },
      apiData: {
        apikey: '',
      },
    };

    const controller = {
      init() {
        view.init();
      },
      async geonamesApi() {
        const url = `http://api.geonames.org/searchJSON?q=${model.input.location}&maxRows=1&username=bmg1612`;
        const req = await fetch(url);
        try {
          const data = await req.json();
          const apiData = {
            latitude: data.geonames[0].lat,
            longitude: data.geonames[0].lng,
          };
          model.apiObjects.geonamesData = apiData;
          this.setLatitudeAndLongitude();
          console.log('::: Fetched data from Geonames API :::');
          return model.apiObjects.geonamesData;
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      },
      setInputData() {
        model.input.location = document.getElementById('location').value;
        model.input.startDate = document.getElementById('start-date').value;
        model.input.endDate = document.getElementById('end-date').value;
      },
      setLatitudeAndLongitude() {
        model.apiData.latitude = model.apiObjects.geonamesData.latitude;
        model.apiData.longitude = model.apiObjects.geonamesData.longitude;
      },
      setDates() {
        // Getting the dates
        model.dates.today = new Date();
        model.dates.nextWeek = new Date(
          model.dates.today.getTime() + 7 * 24 * 60 * 60 * 1000
        );
        model.dates.twoWeeksFromNow = new Date(
          model.dates.today.getTime() + 16 * 24 * 60 * 60 * 1000
        );
        // Date input values transformed to last year
        // For the case someone searches for a date after
        // 16 days from now, which will be covered by
        // historical fetch from weatherbit API
        model.dates.lastYearStartDate = new Date(model.input.startDate);
        model.dates.lastYearEndDate = new Date(model.input.endDate);
        model.dates.lastYearStartDate.setMonth(
          model.dates.lastYearStartDate.getMonth() - 12
        );
        model.dates.lastYearEndDate.setMonth(
          model.dates.lastYearEndDate.getMonth() - 12
        );

        /* Helper function to change the format from Date object to regular date
        as in 'Tue Dec 24 2019 21:00:00 GMT-0300' to => 2019-12-24 */
        const changeFormat = (date = '') => {
          const dd = String(date.getDate()).padStart(2, '0');
          const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
          const yyyy = date.getFullYear();
          let convertedDate = date;
          convertedDate = `${yyyy}-${mm}-${dd}`;
          return convertedDate;
        };

        // Formatting today's date
        model.dates.today = changeFormat(model.dates.today);
        // Formatting next weeks's date
        model.dates.nextWeek = changeFormat(model.dates.nextWeek);
        // Formatting 16 days from now
        model.dates.twoWeeksFromNow = changeFormat(model.dates.twoWeeksFromNow);
        // Changing the format of last year dates
        model.dates.lastYearStartDate = changeFormat(
          model.dates.lastYearStartDate
        );
        model.dates.lastYearEndDate = changeFormat(model.dates.lastYearEndDate);

        // Converted today, start date and end date to calculate countdowns
        model.dates.convertedToday = new Date();
        model.dates.convertedStartDate = new Date(model.input.startDate);
        model.dates.convertedEndDate = new Date(model.input.endDate);

        // Calculating the length of the trip
        model.dates.diffTimeTrip = Math.abs(
          model.dates.convertedEndDate - model.dates.convertedStartDate
        );
        model.dates.diffDaysTrip = Math.ceil(
          model.dates.diffTimeTrip / (1000 * 60 * 60 * 24)
        );

        // Calculating the difference in days between today and the start date
        model.dates.diffTimeCountdown = Math.abs(
          model.dates.convertedStartDate - model.dates.convertedToday
        );
        model.dates.diffDaysCountdown = Math.ceil(
          model.dates.diffTimeCountdown / (1000 * 60 * 60 * 24)
        );
      },
      async weatherbitApi() {
        // Getting API key from the server
        const req = await fetch('http://localhost:8081/api');
        try {
          const data = await req.json();
          model.apiData.apiKey = data.weatherKey;
          console.log('::: Got the key of Weatherbit API :::');

          // If the trip between next week and 16 days
          if (
            model.input.startDate > model.dates.nextWeek &&
            model.input.startDate <= model.dates.twoWeeksFromNow
          ) {
            const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&key=${model.apiData.apiKey}`;
            const res = await fetch(url);
            model.apiObjects.apiResponse = await res.json();
            console.log('::: Fetched data from Weatherbit API :::');
            // Creating the object manually because the disposition of the response object is different
            model.apiObjects.weatherResponse = {
              city_name: model.apiObjects.apiResponse.city_name,
              country_code: model.apiObjects.apiResponse.country_code,
              // Getting the array n. 8 because it is on the middle of 16
              temp: model.apiObjects.apiResponse.data[8].temp,
              app_temp: (
                (model.apiObjects.apiResponse.data[8].app_max_temp +
                  // eslint-disable-next-line prettier/prettier
                  model.apiObjects.apiResponse.data[10].app_min_temp) /
                2
              ).toFixed(1),
              weather: {
                description:
                  model.apiObjects.apiResponse.data[8].weather.description,
              },
            };
            return model.apiObjects.weatherResponse;
            // In case the trip is after 16 days from now
            // In this case, this API limits to one request per day in the free version
          } else if (model.input.startDate > model.dates.twoWeeksFromNow) {
            const url = `https://api.weatherbit.io/v2.0/history/hourly?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&start_date=${model.dates.lastYearStartDate}&end_date=${model.dates.lastYearEndDate}&key=${model.apiData.apiKey}`;
            const res = await fetch(url);
            model.apiObjects.apiResponse = await res.json();
            console.log('::: Fetched data from Weatherbit API :::');
            // Creating the object manually because the disposition of the response object is different
            model.apiObjects.weatherResponse = {
              city_name: model.apiObjects.apiResponse.city_name,
              country_code: model.apiObjects.apiResponse.country_code,
              // Getting the array n. 8 because it is on the middle of 16
              temp: model.apiObjects.apiResponse.data.temp,
              // Simulating apparent temperature, since it is not given in this response
              app_temp: model.apiObjects.apiResponse.data.app_temp,
              weather: {
                description:
                  model.apiObjects.apiResponse.data[8].weather.description,
              },
            };
            return model.apiObjects.weatherResponse;
            // If the trip is this week
          } else {
            const url = `https://api.weatherbit.io/v2.0/current?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&key=${model.apiData.apiKey}`;
            const res = await fetch(url);
            model.apiObjects.apiResponse = await res.json();
            console.log('::: Fetched data from Weatherbit API :::');
            model.apiObjects.weatherResponse = {
              city_name: model.apiObjects.apiResponse.data[0].city_name,
              country_code: model.apiObjects.apiResponse.data[0].country_code,
              temp: model.apiObjects.apiResponse.data[0].temp,
              app_temp: model.apiObjects.apiResponse.data[0].app_temp,
              weather: {
                description:
                  model.apiObjects.apiResponse.data[0].weather.description,
              },
            };
            return model.apiObjects.weatherResponse;
          }
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      },
      async pixabayApi() {
        // Getting API key from the server
        const req = await fetch('http://localhost:8081/api');
        try {
          const data = await req.json();
          model.apiData.apiKey = data.photoKey;
          console.log('::: Got the key of Pixabay API :::');
          // Fetching data
          const url = `https://pixabay.com/api/?key=${model.apiData.apiKey}&q=${model.apiObjects.weatherResponse.city_name}&image_type=photo`;
          const res = await fetch(url);
          model.apiObjects.apiResponse = await res.json();
          console.log('::: Fetched data from Pixabay API :::');
          // If it is a big city, there will be 20 'hits' photos
          // Then it will be randomly chosen
          if (model.apiObjects.apiResponse.hits.length === 20) {
            model.apiObjects.photoResponse =
              model.apiObjects.apiResponse.hits[
                Math.floor(Math.random() * 21)
              ].webformatURL;
            return model.apiObjects.photoResponse;
            // If it is a smaller city with less than 20 hits
            // The first one is chosen
          } else {
            model.apiObjects.photoResponse =
              model.apiObjects.apiResponse.hits[0].webformatURL;
            return model.apiObjects.photoResponse;
          }
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      },
      async postData(url = '', data = {}) {
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        try {
          model.apiObjects.newData = await res.json();
          return model.apiObjects.newData;
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      },
      async updateUI() {
        /* eslint-disable prettier/prettier */
        view.resultsDiv.innerHTML = `
        <h2>Your trip to ${model.apiObjects.newData.city_name}</h2>
        <div class="results__image">
          <img src="${model.apiObjects.newData.photo}" alt="Photo of ${
          model.apiObjects.newData.city_name
        } from Pixabay">
        </div>;  
        <div class="results__text">
          <p>Typically, the weather for ${model.apiObjects.newData.city_name}/${
          model.apiObjects.newData.country_code
        } on the desired  date is 
          ${
            model.apiObjects.newData.temperature
          }ºC with ${model.apiObjects.newData.description.toLowerCase()} and
          apparent temperature of ${model.apiObjects.newData.app_temp}ºC.
          </p>
          <p><a href="https://www.weatherbit.io/" target="_blank">Source</a></p>
          <br>
          <p>Countdown: In ${
            model.dates.diffDaysCountdown
          } days you will be in ${model.apiObjects.newData.city_name}!
          You will stay there for ${model.dates.diffDaysTrip} days!</p>
          <h3>To-do List</h3>
          <div class="toDo__header">
              <input type="text" id="myInput" placeholder="Title...">
              <span class="addBtn">Add</span>
          </div>   
          <ul id="myUL"></ul>
        </div>`;
        if (storageAvailable('localStorage')) {
          preFillToDoData();
        }
        /* eslint-enable prettier/prettier */
        view.resultsDiv.style.display = 'grid';
        view.resultsDiv.scrollIntoView({ behavior: 'smooth' });
      },
    };

    const view = {
      init() {
        this.form = document.querySelector('.form');
        this.resultsDiv = document.getElementById('results');

        this.render();
      },
      render() {
        if (storageAvailable('localStorage')) {
          preFillTripData();
        }
        this.form.addEventListener('submit', async (event) => {
          event.preventDefault();
          controller.setInputData();
          // Saving the input data on the Local Storage
          if (storageAvailable('localStorage')) {
            saveTripData();
          }
          controller.setDates();
          controller
            .geonamesApi()
            .then(() => controller.weatherbitApi())
            .then(() => controller.pixabayApi())
            .then(() =>
              controller.postData('/addText', {
                city_name: model.apiObjects.weatherResponse.city_name,
                country_code: model.apiObjects.weatherResponse.country_code,
                temp: model.apiObjects.weatherResponse.temp,
                app_temp: model.apiObjects.weatherResponse.app_temp,
                description:
                  model.apiObjects.weatherResponse.weather.description,
                photo: model.apiObjects.photoResponse,
              })
            )
            .then(() => controller.updateUI());
        });
      },
    };

    controller.init();
  }
);

export { getTravelResults };
