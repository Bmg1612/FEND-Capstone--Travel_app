import { storageAvailable, saveToDoData } from './localStorage';

const toDoFunction = document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');

  form.addEventListener('submit', () => {
    // Adding timeout because the 'span' event depends on the creation
    // of the element, which occurs when the form is submitted.
    setTimeout(() => {
      console.log('Ready.');

      /**
       * Add a "checked" symbol when clicking on a list item and remove the item if the 'X' is clicked.
       * @event
       * @async
       * @returns {void} Nothing.
       */
      const list = document.getElementById('myUL');
      list.addEventListener('click', (event) => {
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
        // eslint-disable-next-line prettier/prettier
      });

      /**
       * Create a new list item when clicking on the "Add" button.
       * @event
       * @async
       * @returns {void} Nothing.
       */
      const addButton = document.querySelector('.addBtn');
      addButton.addEventListener('click', () => {
        const li = document.createElement('li');
        const allItems = document.querySelectorAll('li');
        const inputValue = document.getElementById('myInput').value;
        li.textContent = inputValue;
        if (inputValue === '') {
          alert('You must write something!');
        } else if (allItems.length <= 5) {
          document.getElementById('myUL').appendChild(li);
          if (storageAvailable('localStorage')) {
            saveToDoData();
          }
        } else {
          alert('There is no more space for items. Sorry!');
        }
        document.getElementById('myInput').value = '';

        const span = document.createElement('SPAN');
        const txt = document.createTextNode('\u00D7');
        span.className = 'close';
        span.appendChild(txt);
        li.appendChild(span);
      });
    }, 5000);
  });
});

export { toDoFunction };
