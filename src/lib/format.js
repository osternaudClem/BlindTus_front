/**
 * @name formatMoviesSearch
 * @param {Object[]} movies
 * @returns {Object[]}
 */
export function formatMoviesSearch(movies) {
  const formatedMovies = [];

  movies.map((movie) => {
    movie.label = movie.title_fr;
    movie.type = movie.category.type;
    formatedMovies.push(movie);
    return null;
  });

  return formatedMovies;
}
