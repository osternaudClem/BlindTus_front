import stringSimilarity from 'string-similarity';

export function isMovieAlreadyAdded(moviesList, movie) {
  let exist = false;

  moviesList.map(movieList => {
    if (movieList.title === movie.original_title) {
      exist = true;
    }

    return exist;
  });

  return exist;
}

export function checkSimilarity(content, titles, score = 0.8) {
  let isCorrect = false;

  titles.map(title => {
    const similarity = stringSimilarity.compareTwoStrings(
      content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    if (similarity >= score) {
      isCorrect = true;
    }

    return null;
  });

  return isCorrect;
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}