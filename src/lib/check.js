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
