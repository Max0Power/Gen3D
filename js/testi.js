/**
 * (c) 2018 Jussi Parviainen, Harri Linna, Wiljam Rautiainen, Pinja Turunen
 * Licensed under CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @version 12.12.2018
 */

/**
 * toFahrenheit :: Number -> Number
 * Convert degrees Celsius to degrees Fahrenheit.
 * @example
 *   > toFahrenheit(0)
 *   32
 *   > toFahrenheit(100)
 *   212
 *   > toFahrenheit(100)
 *   213 // error
 */
function toFahrenheit(degreesCelsius) {
  return degreesCelsius * 9 / 5 + 32;
}
