import axios from 'axios';
import { api } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function getFullHistory(userId) {
  return async function (dispatch) {
    try {
      const success = await axios.get(`${API}/history?user=${userId}`);
      dispatch({ type: types.GET_HISTORY_SUCCESS, history: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}


export function saveHistory(history) {
  return async function (dispatch) {
    try {
      const success = await axios.post(`${API}/history`, {
        ...history
      });

      dispatch({ type: types.ADD_HISTORY_SUCCESS, history: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}