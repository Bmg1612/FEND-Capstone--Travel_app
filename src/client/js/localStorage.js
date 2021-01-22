/**
 * Checks if Local Storage is available on the browser.
 * @param {string} type The local storage property name.
 * @returns {boolean} True if it works and error if it does not.
 */
const storageAvailable = (type) => {
  let storage = '';
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

/**
 * Saves the data that the user puts on the form.
 * @returns {void} Nothing. Just saves the data in the local storage.
 */
const saveTripData = () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const location = document.getElementById('location').value;

  // Saving the sent data
  localStorage.setItem('startDate', startDate);
  localStorage.setItem('endDate', endDate);
  localStorage.setItem('location', location);

  return true;
};

/**
 * Pre-fill the data if it is on the local storage object.
 * @returns {void} Nothing.
 */
const preFillTripData = () => {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const locationInput = document.getElementById('location');

  // Checking if the inputs are empty
  // And if there is data on the local storage
  if (
    startDateInput.value === '' &&
    endDateInput.value === '' &&
    locationInput.value === '' &&
    localStorage.getItem('startDate') !== null
  ) {
    startDateInput.defaultValue = localStorage.getItem('startDate');
    endDateInput.defaultValue = localStorage.getItem('endDate');
    locationInput.defaultValue = localStorage.getItem('location');
  }
  return true;
};

/**
 * Saves the data that the user puts on the To-do list.
 * @returns {void} Nothing. Just saves the data in the local storage.
 */
const saveToDoData = () => {
  const items = document.querySelectorAll('LI');
  for (const [index, item] of items.entries()) {
    const itemWithoutSpan = item.childNodes[0];
    const toDo = itemWithoutSpan.textContent;
    localStorage.setItem(`toDoItem_${index + 1}`, toDo);
  }
  return true;
};

/**
 * Pre-fill the To-do data if it is on the local storage object.
 * @returns {void} Nothing.
 */
const preFillToDoData = () => {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key.startsWith('toDo')) {
      const li = document.createElement('li');
      li.textContent = value;
      const span = document.createElement('SPAN');
      const txt = document.createTextNode('\u00D7');
      span.className = 'close';
      span.appendChild(txt);
      li.appendChild(span);
      document.getElementById('myUL').appendChild(li);
    }
  }
  return true;
};

export {
  storageAvailable,
  saveTripData,
  preFillTripData,
  saveToDoData,
  preFillToDoData,
};
