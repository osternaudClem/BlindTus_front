import axios from 'axios';
import { api } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function getMusics(limit) {
  return async function(dispatch) {
    try {
      const success = await axios.get(`${API}/musics?limit=${limit}`);
      dispatch({ type: types.GET_MUSICS_SUCCESS, musics: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function reset() {
  return async function(dispatch) {
    dispatch({ type: types.RESET_MUSICS_SUCCESS, musics: [] });
  }
}