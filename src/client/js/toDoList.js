const toDoFunction = document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');

  form.addEventListener('submit', () => {
    // Adding timeout because the 'span' event depends on the creation
    // of the element, which occurs when the form is submitted.
    setTimeout(() => {
      console.log('Ready.');

      /**
       * Add a "checked" symbol when clicking on a list item
       * @event
       * @async
       * @returns {void} Nothing.
       */
      const list = document.getElementById('myUL');
      list.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
          event.target.classList.toggle('checked');
        } else if (
          event.target.tagName === 'SPAN' &&
          event.target.parentElement.tagName === 'LI'
        ) {
          console.log('In here!')
          const itemToBeRemoved = event.target.parentElement;
          itemToBeRemoved.remove();
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
        } else {
          alert('There is no more space for items. Sorry!');
        }
        document.getElementById('myInput').value = '';

        const span = document.createElement('SPAN');
        const txt = document.createTextNode('\u00D7');
        span.className = 'close';
        span.appendChild(txt);
        li.appendChild(span);

        /**
         * Click on a close button to hide the current list item.
         * @event
         * @async
         * @returns {void} Nothing.
         */
        /* const eraseItems = document.getElementsByClassName('close');
        for (const x of eraseItems) {
          x.onclick = () => {
            const itemToBeRemoved = x.parentElement;
            itemToBeRemoved.remove();
          };
        } */
      });
    }, 5000);
  });
});

export { toDoFunction };
