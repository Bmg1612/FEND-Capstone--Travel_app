# Front End Nanodegree Capstone

This project requires a travel app that, at a minimum, obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs.

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

Obs: The Weatherbit API only gets the *current* weather and a *16 daily forecast* for free. I added the historical API to get weather data for other periods of time (it shows the weather of the same time last year, better than nothing, uh?). But the historical is limited to 1 request per day (and sometimes not even that). 

- [Pixabay API](https://pixabay.com/pt/service/about/api/): Gets a photo of the given location.
### Jest
The code is tested using Jest. The directory "test" is for that purpose.
### Service Workers
I used Workbox to add offline support.

Obs: The API cannot be fetched offline. In this project the service worker is used only to mantain the webpage if there is no internet.
## Contributions
Any contributtions and/or suggestions are greatly appreciated.
