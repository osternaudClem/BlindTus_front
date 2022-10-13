import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

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
      const success = await callApi.get('/historytoday');
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
      const success = await callApi.get(`/historytoday/${historyId}`);
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
      const success = await callApi.get(`/historytoday/user/${userId}`);
      return onSuccess(success);
    } catch (error) {
      return onError(error);
    }
  };
}

export function saveHistory(history) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/historytoday', {
        ...history
      });

      dispatch({ type: types.SAVE_HISTORY_TODAY_SUCCESS, history: success.data });


      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}