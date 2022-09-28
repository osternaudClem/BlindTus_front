import axios from 'axios';
import { api } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function getCover() {
  return async function(dispatch) {
    try {
      const success = await axios.get(`${API}/movies`);
      dispatch({ type: types.SAVE_COVER_SUCCESS, movies: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}