import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

export function login(email, password) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/users/login', {
        email,
        password,
      });
      dispatch({ type: types.GET_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function confirm(token) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/users/confirm', {
        token
      });
      dispatch({ type: types.GET_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      return error.data;
    }
  };
}

export function getUserById(user_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/users/${user_id}`);
      dispatch({ type: types.GET_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function signup(user) {
  return async function (dispatch) {
    try {
      const success = await callApi.post(`/users`, { ...user });     
      dispatch({ type: types.POST_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export function updateUser(userId, update) {
  return async function () {
    try {
      const success = await callApi.patch(`/users/${userId}`, { ...update });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export function changePassword(userId, update) {
  return async function () {
    try {
      const success = await callApi.patch(`/users/changePassword/${userId}`, { ...update });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export function askNewPassword(email) {
  return async function () {
    try {
      const success = await callApi.get(`/users/ask-new-password/${email}`);
      return success.data;
    } catch (error) {
      return error.response;
    }
  }
}

export function saveNewPassword(token, password) {
  return async function () {
    try {
      const success = await callApi.post(`/users/save-new-password`, {
        password,
        token,
      });
      return success.data;
    } catch (error) {
      return error.response;
    }
  }
}