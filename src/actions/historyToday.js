import axios from 'axios';
import { api } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function getFullHistory() {
  return async function (dispatch) {
    function onSuccess(success) {
      dispatch({ type: types.GET_ALL_HISTORY_TODAY_SUCCESS, history: success.data });
      return success.data;
    }

    function onError(error) {
      throw error.response;
    }

    try {
      const success = await axios.get(`${API}/historytoday`);
      return onSuccess(success);
    } catch (error) {
      return onError(error);
    }
  };
}

export function getHistory(historyId) {
  return async function (dispatch) {
    function onSuccess(success) {
      dispatch({ type: types.GET_HISTORY_TODAY_SUCCESS, history: success.data });
      return success.data;
    }

    function onError(error) {
      throw error.response;
    }

    try {
      const success = await axios.get(`${API}/historytoday/${historyId}`);
      return onSuccess(success);
    } catch (error) {
      return onError(error);
    }
  };
}

export function getTodayUser(userId) {
  return async function (dispatch) {
    function onSuccess(success) {
      dispatch({ type: types.GET_HISTORY_TODAY_SUCCESS, history: success.data });
      return success.data;
    }

    function onError(error) {
      throw error.response;
    }

    try {
      const success = await axios.get(`${API}/historytoday/user/${userId}`);
      return onSuccess(success);
    } catch (error) {
      return onError(error);
    }
  };
}

export function saveHistory(history) {
  return async function (dispatch) {
    try {
      const success = await axios.post(`${API}/historytoday`, {
        ...history
      });

      dispatch({ type: types.SAVE_HISTORY_TODAY_SUCCESS, history: success.data });


      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}