/* eslint-disable */
import {
  storageAvailable,
  saveTripData,
  preFillTripData,
  saveToDoData,
  preFillToDoData,
} from '../src/client/js/localStorage';

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
describe('Testing the local storage functionality', () => {
  // Simulating DOM environment for testing
  document.body.innerHTML = `
  <form class="form">
      <label for="location">Where do you want to go?</label>
      <input type="text" name="location" id="location" class="location__input"
        placeholder="Put the desired location here" required>
      <label for="start-date">When are you going?</label>
      <input type="date" id="start-date" class="dates__input" required>
      <label for="end-date">Until when?</label>
      <input type="date" id="end-date" class="dates__input" required>
      <button type="submit" id="button">Send</button>
    </form>
  </div>
  <div id="results" class="main__results"></div>`;

  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const location = document.getElementById('location').value;

  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const locationInput = document.getElementById('location');

  const functions = [
    storageAvailable('localStorage'),
    saveTripData(),
    preFillTripData(),
    saveToDoData(),
    preFillToDoData(),
  ];

  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test('Testing if the local storage is working', () => {
    functions.forEach((func) => expect(func).toBeTruthy());
  });
});
