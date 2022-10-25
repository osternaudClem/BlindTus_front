import stringSimilarity from 'string-similarity';

/**
 * @name isMovieAlreadyAdded
 * @param {Object[]} moviesList
 * @param {Object} movie
 * @returns {boolean}
 */
export function isMovieAlreadyAdded(moviesList, movie) {
  let exist = false;

  moviesList.map((movieList) => {
    if (movieList.title === movie.original_title) {
      exist = true;
    }

    return exist;
  });

  return exist;
}

/**
 * @name checkSimilarity
 * @param {string} content
 * @param {string} titles
 * @param {?number} score
 * @returns {boolean}
 */
export function checkSimilarity(content, titles, score = 0.8) {
  let isCorrect = false;

  titles.map((title) => {
    const similarity = stringSimilarity.compareTwoStrings(
      content
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    );

    if (similarity >= score) {
      isCorrect = true;
    }

    return null;
  });

  return isCorrect;
}

/**
 * @name isMobileDevice
 * @returns {boolean}
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * @name isYoutubeUrl
 * @param {string} url
 * @returns {boolean}
 */
export function isYoutubeUrl(url) {
  if (url) {
    var regExp =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtube\.com\/(v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(regExp)) {
      return true;
    }
  }
  return false;
}
