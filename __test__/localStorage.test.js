/* eslint-disable */
import { eventLocalStorage } from '../src/client/js/localStorage';

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
describe('Testing the local storage functionality', () => {
  // The test() function has two arguments - a string description, and an actual test as a callback function.
  test('Testing if the local storage is working', () => {
    expect(eventLocalStorage).toBeUndefined();
  });
});
