import stringSimilarity from 'string-similarity';

/**
 * @name isMediaAlreadyAdded
 * @param {Object[]} mediasList
 * @param {Object} media
 * @param {String} type
 * @returns {boolean}
 */
export function isMediaAlreadyAdded(mediasList, media, type) {
  let exist = false;

  mediasList.map((mediaList) => {
    if (
      (mediaList.title === media.original_title ||
        mediaList.title === media.original_name) &&
      ((mediaList.release_date &&
        mediaList.release_date.toString() ===
          media.release_date.substring(0, 4)) ||
        (mediaList.first_air_date &&
          mediaList.first_air_date ===
            parseInt(media.first_air_date.slice(0, 4))))
    ) {
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
