const saveData = () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const location = document.getElementById('location').value;

  window.localStorage.setItem('startDate', startDate);
  window.localStorage.setItem('endDate', endDate);
  window.localStorage.setItem('location', location);

  console.log(localStorage);
};

const getData = () => {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const locationInput = document.getElementById('location');

  if (
    startDateInput.value === '' &&
    endDateInput.value === '' &&
    locationInput.value === ''
  ) {
    startDateInput.defaultValue = window.localStorage.getItem('startDate');
    endDateInput.defaultValue = window.localStorage.getItem('endDate');
    locationInput.defaultValue = window.localStorage.getItem('location');
  }
};

export { saveData, getData };
