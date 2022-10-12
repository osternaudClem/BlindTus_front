import axios from 'axios';
import { api, requestHeader } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function getMusic() {
  return async function(dispatch) {
    try {
      const success = await axios.get(`${API}/musicsday/today`, requestHeader);
      dispatch({ type: types.GET_TODAY_MUSIC_SUCCESS, game: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}
