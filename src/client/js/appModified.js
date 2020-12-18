const getTravelResults = document.addEventListener(
  'DOMContentLoaded',
  async () => {
    const model = {
      input: {
        location: null,
        startDate: null,
        endDate: null,
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
    };

    const view = {
      init() {
        this.form = document.querySelector('.form');

        this.render();
      },
      render() {
        this.form.addEventListener('submit', async (event) => {
          event.preventDefault();
          controller.setInputData();
          controller.geonamesApi();
          /* .then(() => pixabayApi())
        .then(() =>
          postData('/addText', {
            city_name: weatherResponse.city_name,
            country_code: weatherResponse.country_code,
            temp: weatherResponse.temp,
            app_temp: weatherResponse.app_temp,
            description: weatherResponse.weather.description,
            photo: photoResponse,
          })
        )
        .then(() => updateUI()); */
        });
      },
    };

    controller.init();
  }
);

export { getTravelResults };
