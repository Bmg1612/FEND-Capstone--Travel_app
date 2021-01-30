import {
  storageAvailable,
  saveTripData,
  preFillTripData,
  saveToDoData,
  preFillToDoData,
} from './localStorage';

const getTravelResults = document.addEventListener(
  'DOMContentLoaded',
  async () => {
    /* ======= Model ======= */
    const model = {
      // Input values
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
      },
      // dates in the Date() format
      converted: {
        convertedToday: null,
        convertedStartDate: null,
        convertedEndDate: null,
      },
      differenceDays: {
        // Length of the trip
        diffTimeTrip: null,
        diffDaysTrip: null,
        // Cowntodown to trip
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
        latitude: null,
        longitude: null,
      },
    };

    /* ======= Controller ======= */
    const controller = {
      init() {
        appView.init();
        this.mainFunction();
      },
      /**
       * Changes the model.input properties to the values that the user entendered.
       * @returns {void} Nothing.
       */
      setInputData() {
        model.input.location = document.getElementById('location').value;
        model.input.startDate = document.getElementById('start-date').value;
        model.input.endDate = document.getElementById('end-date').value;
      },
      /**
       * Changes the model.apiData latitude and longitude properties to the ones of the place the user will go.
       * @returns {void} Nothing.
       */
      setLatitudeAndLongitude() {
        model.apiData.latitude = model.apiObjects.geonamesData.latitude;
        model.apiData.longitude = model.apiObjects.geonamesData.longitude;
      },
      /**
       * All the functions related to dates of the weatherbit api.
       * @returns {void} Nothing.
       */
      setDates() {
        // Getting the dates
        model.dates.today = new Date();
        model.dates.nextWeek = new Date(
          model.dates.today.getTime() + 7 * 24 * 60 * 60 * 1000
        );
        model.dates.twoWeeksFromNow = new Date(
          model.dates.today.getTime() + 16 * 24 * 60 * 60 * 1000
        );
        /* Date input values transformed to last year
         * For the case someone searches for a date after
         * 16 days from now, which will be covered by
         * historical fetch from weatherbit API
         */
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

        /* Converted today, start date and end date to calculate countdowns
         * To a format like this: Tue Dec 24 2019 21:00:00 GMT-0300
         */
        model.converted.convertedToday = new Date();
        model.converted.convertedStartDate = new Date(model.input.startDate);
        model.converted.convertedEndDate = new Date(model.input.endDate);

        // Calculating the length of the trip
        model.differenceDays.diffTimeTrip = Math.abs(
          model.converted.convertedEndDate - model.converted.convertedStartDate
        );
        model.differenceDays.diffDaysTrip = Math.ceil(
          model.differenceDays.diffTimeTrip / (1000 * 60 * 60 * 24)
        );

        // Calculating the difference in days between today and the start date
        model.differenceDays.diffTimeCountdown = Math.abs(
          model.converted.convertedStartDate - model.converted.convertedToday
        );
        model.differenceDays.diffDaysCountdown = Math.ceil(
          model.differenceDays.diffTimeCountdown / (1000 * 60 * 60 * 24)
        );
      },
      mainFunction() {
        if (storageAvailable('localStorage')) {
          preFillTripData();
        }
        appView.form.addEventListener('submit', async (event) => {
          event.preventDefault();

          appView.resultsDiv.style.display = 'none';
          appView.loader.style.display = 'inline-block';
          appView.loader.scrollIntoView({ behavior: 'smooth' });

          this.setInputData();
          // Saving the input data on the Local Storage
          if (storageAvailable('localStorage')) {
            saveTripData();
          }
          this.setDates();
          apis
            .geonamesApi()
            .then(() => apis.weatherbitApi())
            .then(() => apis.pixabayApi())
            .then(() =>
              apis.postData('/addText', {
                city_name: model.apiObjects.weatherResponse.city_name,
                country_code: model.apiObjects.weatherResponse.country_code,
                temp: model.apiObjects.weatherResponse.temp,
                app_temp: model.apiObjects.weatherResponse.app_temp,
                description:
                  model.apiObjects.weatherResponse.weather.description,
                photo: model.apiObjects.photoResponse,
              })
            )
            .then(() => appView.render());
        });
      },
    };

    /* ======= APIS ======= */
    const apis = {
      /**
       * Fetches latitude and longitude from geonames API.
       * @async
       * @returns {object} The object containing the desired latitude and longitude.
       */
      async geonamesApi() {
        const url = `https://secure.geonames.org/searchJSON?q=${model.input.location}&maxRows=1&username=bmg1612`;
        try {
          const req = await fetch(url);
          const data = await req.json();
          const apiData = {
            latitude: data.geonames[0].lat,
            longitude: data.geonames[0].lng,
          };
          model.apiObjects.geonamesData = apiData;
          controller.setLatitudeAndLongitude();
          return model.apiObjects.geonamesData;
        } catch (e) {
          document.getElementById('error').innerHTML =
            '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
          document.querySelector('.loader').style.display = '';
          document.getElementById('error').style.display = 'block';
          return false;
        }
      },
      /**
       * Fetches weather and city/country data from weatherbit API.
       * @async
       * @returns {object} The object containing the desired weather and city/country data.
       */
      async weatherbitApi() {
        try {
          // Getting API key from the server
          const req = await fetch('/api');
          const data = await req.json();
          model.apiData.apiKey = data.weatherKey;

          // Getting the API data //

          // If the trip between next week and 16 days
          if (
            model.input.startDate > model.dates.nextWeek &&
            model.input.startDate <= model.dates.twoWeeksFromNow
          ) {
            const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&key=${model.apiData.apiKey}`;
            const res = await fetch(url);
            model.apiObjects.apiResponse = await res.json();
            // Getting only the data that I will use in the new object
            model.apiObjects.weatherResponse = {
              city_name: model.apiObjects.apiResponse.city_name,
              country_code: model.apiObjects.apiResponse.country_code,
              // Getting the array n. 8 because it is on the middle of 16
              temp: model.apiObjects.apiResponse.data[8].temp,
              // Simulating apparent temperature, since it is not given in this response
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
            /* In case the trip is after 16 days from now
             * In this case, this API limits to one request per day in the free version
             * It will fetch the weather from the same date last year
             */
          } else if (model.input.startDate > model.dates.twoWeeksFromNow) {
            try {
              const url = `https://api.weatherbit.io/v2.0/history/hourly?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&start_date=${model.dates.lastYearStartDate}&end_date=${model.dates.lastYearEndDate}&key=${model.apiData.apiKey}`;
              const res = await fetch(url);
              model.apiObjects.apiResponse = await res.json();
              // Getting only the data that I will use in the new object
              model.apiObjects.weatherResponse = {
                city_name: model.apiObjects.apiResponse.city_name,
                country_code: model.apiObjects.apiResponse.country_code,
                temp: model.apiObjects.apiResponse.data.temp,
                app_temp: model.apiObjects.apiResponse.data.app_temp,
                weather: {
                  description:
                    model.apiObjects.apiResponse.data[8].weather.description,
                },
              };
              return model.apiObjects.weatherResponse;
            } catch (error) {
              const url = `https://api.weatherbit.io/v2.0/current?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&key=${model.apiData.apiKey}`;
              const res = await fetch(url);
              model.apiObjects.apiResponse = await res.json();
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
            // If the trip is this week
          } else {
            const url = `https://api.weatherbit.io/v2.0/current?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&key=${model.apiData.apiKey}`;
            const res = await fetch(url);
            model.apiObjects.apiResponse = await res.json();
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
        } catch (e) {
          document.getElementById('error').innerHTML =
            '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
          document.querySelector('.loader').style.display = '';
          document.getElementById('error').style.display = 'block';
          return false;
        }
      },

      /**
       * Fetches a photo of the desired location from pixabay API.
       * @async
       * @returns {object} The object containing the photo.
       */
      async pixabayApi() {
        try {
          // Getting API key from the server
          const req = await fetch('/api');
          const data = await req.json();
          model.apiData.apiKey = data.photoKey;
          // Fetching data
          const url = `https://pixabay.com/api/?key=${model.apiData.apiKey}&q=${model.apiObjects.weatherResponse.city_name}&image_type=photo`;
          const res = await fetch(url);
          model.apiObjects.apiResponse = await res.json();
          /* If it is a big city, there will be 20 'hits' photos
           * Then it will be randomly chosen
           */
          if (model.apiObjects.apiResponse.hits.length === 20) {
            model.apiObjects.photoResponse =
              model.apiObjects.apiResponse.hits[
                Math.floor(Math.random() * 21)
              ].webformatURL;
            return model.apiObjects.photoResponse;
            /* If it is a smaller city with less than 20 hits
             * The first one is chosen
             */
          } else {
            model.apiObjects.photoResponse =
              model.apiObjects.apiResponse.hits[0].webformatURL;
            return model.apiObjects.photoResponse;
          }
        } catch (e) {
          document.getElementById('error').innerHTML =
            '<h3 class="error"><strong>Error!</strong> Sorry, there was an error fetching the image, can you please reload the page and try again?</h3>';
          document.querySelector('.loader').style.display = '';
          document.getElementById('error').style.display = 'block';
          return false;
        }
      },

      /**
       * Posts the retrieved API data so that we can update the UI.
       * @async
       * @returns {object} The object containing the data that we will use to update the UI.
       */
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
        } catch (e) {
          document.getElementById('error').innerHTML =
            '<h3 class="error"><strong>Error!</strong> Sorry, there was an error fetching the image, can you please reload the page and try again?</h3>';
          document.querySelector('.loader').style.display = '';
          document.getElementById('error').style.display = 'block';
          return false;
        }
      },
    };

    /* ======= View ======= */
    const appView = {
      init() {
        this.form = document.querySelector('.form');
        this.loader = document.querySelector('.loader');
        this.resultsDiv = document.getElementById('results');
      },

      /**
       * Updates the UI with the extracted data form the APIs.
       * @async
       * @returns {void} Nothing.
       */
      render() {
        // prettier-ignore
        appView.resultsDiv.innerHTML = `
        <h2>Your trip to ${model.apiObjects.newData.city_name}</h2>
        <div class="results__image">
          <img src="${model.apiObjects.newData.photo}" alt="Photo of ${model.apiObjects.newData.city_name} from Pixabay">
        </div>;  
        <div class="results__text">
          <p>Typically, the weather for ${model.apiObjects.newData.city_name}/${model.apiObjects.newData.country_code}
             on the desired  date is ${model.apiObjects.newData.temperature}ºC with ${model.apiObjects.newData.description.toLowerCase()}
            and apparent temperature of ${model.apiObjects.newData.app_temp}ºC.
          </p>
          <p><a href="https://www.weatherbit.io/" target="_blank">Source</a></p>
          <br>
          <p>Countdown: In ${model.differenceDays.diffDaysCountdown} days you will be in ${model.apiObjects.newData.city_name}!
             You will stay there for ${model.differenceDays.diffDaysTrip} days!</p>
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
        appView.loader.style.display = '';
        appView.resultsDiv.style.display = '';
        appView.resultsDiv.style.display = 'grid';
        appView.resultsDiv.scrollIntoView({ behavior: 'smooth' });
        toDoView.init();
      },
    };

    const toDoView = {
      init() {
        this.list = document.getElementById('myUL');
        this.addButton = document.querySelector('.addBtn');

        this.render();
      },
      render() {
        /**
         * Add a "checked" symbol when clicking on a list item and remove the item if the 'X' is clicked.
         * @event
         * @async
         * @returns {void} Nothing.
         */
        this.list.addEventListener('click', (event) => {
          if (event.target.tagName === 'LI') {
            event.target.classList.toggle('checked');
            // Erasing the item if the respective 'x' is clicked
          } else if (
            event.target.tagName === 'SPAN' &&
            event.target.parentElement.tagName === 'LI'
          ) {
            const itemToBeRemoved = event.target.parentElement;
            itemToBeRemoved.remove();
            // Erasing the item from the local storage too
            for (const value of Object.values(localStorage)) {
              const deletedItemInnerText = itemToBeRemoved.innerText;
              if (deletedItemInnerText.includes(value)) {
                localStorage.removeItem(
                  Object.keys(localStorage).find(
                    (key) => localStorage[key] === value
                  )
                );
              }
            }
          }
        });

        /**
         * Create a new list item when clicking on the "Add" button.
         * @event
         * @async
         * @returns {void} Nothing.
         */
        this.addButton.addEventListener('click', () => {
          const li = document.createElement('li');
          // const allItems = document.querySelectorAll('li');
          const inputValue = document.getElementById('myInput').value;
          li.textContent = inputValue;
          if (inputValue === '') {
            alert('You must write something!');
          } else {
            document.getElementById('myUL').appendChild(li);
            if (storageAvailable('localStorage')) {
              saveToDoData();
            }
          }
          document.getElementById('myInput').value = '';

          const span = document.createElement('SPAN');
          const txt = document.createTextNode('\u00D7');
          span.className = 'close';
          span.appendChild(txt);
          li.appendChild(span);
        });
      },
    };

    controller.init();
  }
);

export { getTravelResults };
