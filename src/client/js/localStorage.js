// Date input values

const saveData = () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const locationInput = document.getElementById('location').value;

  window.localStorage.setItem('startDate', startDate);
  window.localStorage.setItem('endDate', endDate);
  window.localStorage.setItem('location', locationInput);

  console.log(localStorage);
};

const getData = () => {
  window.localStorage.getItem('startDate');
  window.localStorage.getItem('endDate');
  window.localStorage.getItem('location');

  console.log(getData);
};

export { saveData, getData };
