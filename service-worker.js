const cacheName = "travelPWA-v2";
const dataCacheName = "travelData-v2";
const filesToCache = ["/", "/index.html", "./main.js", "./main.css/"];

const geonamesUrlBase = "http://api.geonames.org/";
const weatherbitUrlBase = "https://api.weatherbit.io/";
const pixabayUrlBase = "https://pixabay.com/api/";

// Caching the app shell on the installation of SW
self.addEventListener("install", function (e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

// Erasing old cache
self.addEventListener("activate", function (e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== cacheName && key !== dataCacheName) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Handling fetch events
self.addEventListener("fetch", (e) => {
  if (
    e.request.url.startsWith(geonamesUrlBase) ||
    e.request.url.startsWith(weatherbitUrlBase) ||
    e.request.url.startsWith(pixabayUrlBase)
  ) {
    e.respondWith(
      fetch(e.request).then((response) => {
        return caches.open(dataCacheName).then((cache) => {
          cache.put(e.request.url, response.clone());
          console.log("[ServiceWorker] Fetched & Cached", e.request.url);
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((response) => {
        console.log("[ServiceWorker] Fetch Only", e.request.url);
        return response || fetch(e.request);
      })
    );
  }
});
