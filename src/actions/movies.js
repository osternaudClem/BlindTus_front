import axios from 'axios';
import { api, requestHeader } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function getCover() {
  return async function (dispatch) {
    try {
      const success = await axios.get(`${API}/movies`, requestHeader);
      dispatch({ type: types.SAVE_COVER_SUCCESS, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function getAll() {
  return async function (dispatch) {
    try {
      const success = await axios.get(`${API}/movies?limit=-1`, requestHeader);
      dispatch({ type: types.GET_ALL_MOVIES, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}

export function findMovies(query) {
  return async function (dispatch) {
    try {
      const success = await axios.get(`${API}/movies/find/${query}`, requestHeader);
      dispatch({ type: types.FIND_MOVIES_SUCCESS, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function saveSelectedMovie(movie_id) {
  return async function(dispatch) { 
    try {
      const success = await axios.get(`${API}/movies/find/id/${movie_id}`, requestHeader);
      dispatch({ type: types.SAVE_SELECTED_MOVIE_SUCCESS, movie: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function saveMovie(movie) {
  return async function() {
    try {
      const success = await axios.post(`${API}/movies`, {
        movie
      }, requestHeader);
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function reset() {
  return async function(dispatch) {
    try {
      dispatch({ type: types.RESET_SELECTED_MOVIE_SUCCESS, movie: [] });
      return {};
    } catch (error) {
      throw error.response;
    }
  };
}