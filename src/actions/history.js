import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

export function getFullHistory(userId) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/history?user=${userId}`);
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
      const success = await callApi.post('/history', {
        ...history
      });

      dispatch({ type: types.ADD_HISTORY_SUCCESS, history: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}