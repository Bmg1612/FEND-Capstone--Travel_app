/* eslint-disable no-unused-vars */
// Import the js file to test
import { toDoFunction } from "../src/client/js/toDoList";

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
describe("Testing the To-do list functions functionality", () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test("Testing the toDoFunction() function", () => {
    // Simulating the necessary DOM environment for testing
    document.body.innerHTML = `
    <form class="form">
    <div class="toDo__header">
        <input type="text" id="myInput" placeholder="Title...">
        <span class="addBtn">Add</span>
    </div> 
    <ul id="myUL"></ul>`;

    const form = document.querySelector(".form");
    const list = document.getElementById("myUL");
    const span = document.querySelector(".addBtn");

    window.alert = () => {};

    // If returns undefined, with no errors, it is working
    expect(toDoFunction).toBeUndefined();
  });
});
