import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name getCover
 * @returns {string|Object[]}
 */
export function getCover() {
  return async function (dispatch) {
    try {
      const success = await callApi.get('/movies');
      dispatch({ type: types.SAVE_COVER_SUCCESS, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name getAll
 * @returns {string|Object[]}
 */
export function getAll() {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/movies?limit=-1`);
      dispatch({ type: types.GET_ALL_MOVIES, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name findMovies
 * @param {string} query
 * @returns {string|Object[]}
 */
export function findMovies(query) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/movies/find/${query}`);
      dispatch({ type: types.FIND_MOVIES_SUCCESS, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name saveSelectedMovie
 * @param {string} movie_id
 * @returns {string|Object}
 */
export function saveSelectedMovie(movie_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/movies/find/id/${movie_id}`);
      dispatch({
        type: types.SAVE_SELECTED_MOVIE_SUCCESS,
        movie: success.data,
      });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name saveMovie
 * @param {Object} movie
 * @returns {string|Object}
 */
export function saveMovie(movie) {
  return async function () {
    try {
      const success = await callApi.post('/movies', {
        movie,
      });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name reset
 * @returns {string|Object}
 */
export function reset() {
  return async function (dispatch) {
    try {
      dispatch({ type: types.RESET_SELECTED_MOVIE_SUCCESS, movie: [] });
      return {};
    } catch (error) {
      throw error.response;
    }
  };
}
