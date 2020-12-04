const listening = require("../src/client/js/listeningTest");

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
describe("Testing the express server functionality", () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test("Testing if the server starts", () => {
    expect(listening).toBeTruthy();
  });
});
