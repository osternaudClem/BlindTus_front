export function objectToArray(object) {
  const result = Object.keys(object).map((key) => object[key]);

  return result;
}

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 *
 * @param {Array} array
 * @param {string} separator
 * @returns {string}
 */
export function addSpaces(array, separator = ', ') {
  return array.join(separator);
}
