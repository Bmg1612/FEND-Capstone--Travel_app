# Front End Nanodegree Capstone

This project requires a travel app that, at a minimum, obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs.

## Important
This project is just to show a chain of API calls. The weather that is being displayed is the current one, since that with the provided API, it is the only free one. In a real project, I would call a specific API for the different dates.

## Content
### Webpack
This project uses Webpack as the build tool. The configuration can be found on the repository. There are different setups for production and development environments.
### HTML, CSS, Sass
This project has an static HTML page, which is styled using Sass (later transformed in CSS with specific webpack loaders).
### Node.js and express
The server is set up using `express` and Node is used to install all the dependencies with `npm`.
### API
There are three APIs:

- [Geonames API](http://www.geonames.org/export/web-services.html): Since Weather bit only accepts coordinates for weather data, geonames get these coordinates;

- [Weatherbit API](https://www.weatherbit.io/): Gets the weather data of the given location;
- 
- [Pixabay API](https://pixabay.com/pt/service/about/api/): Gets a photo of the given location.
### Jest
The code is tested using Jest. The directory "test" is for that purpose.
### Service Workers
I used Workbox to add offline support.

Obs: The API cannot be fetched offline. In this project the service worker is used only to mantain the webpage if there is no internet.
## Contributions
Any contributtions and/or suggestions are greatly appreciated.
## License
[MIT License](https://opensource.org/licenses/MIT).

