import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name login
 * @param {string} email
 * @param {string} password
 * @returns {string|Object}
 */
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

/**
 * @name confirm
 * @param {string} token
 * @returns {string|Object}
 */
export function confirm(token) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/users/confirm', {
        token,
      });
      dispatch({ type: types.GET_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      return error.data;
    }
  };
}

/**
 * @name getUserById
 * @param {string} user_id
 * @returns {string|Object}
 */
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

/**
 * @name signup
 * @param {Object} user
 * @returns {string|Object}
 */
export function signup(user) {
  return async function (dispatch) {
    try {
      const success = await callApi.post(`/users`, { ...user });
      dispatch({ type: types.POST_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  };
}

/**
 * @name updateUser
 * @param {string} user_id
 * @param {Object} update
 * @returns {string|Object}
 */
export function updateUser(user_id, update) {
  return async function () {
    try {
      const success = await callApi.patch(`/users/${user_id}`, { ...update });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  };
}

/**
 * @name changePassword
 * @param {string} user_id
 * @param {Object} update
 * @returns {string|Object}
 */
export function changePassword(user_id, update) {
  return async function () {
    try {
      const success = await callApi.patch(`/users/changePassword/${user_id}`, {
        ...update,
      });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  };
}

/**
 * @name askNewPassword
 * @param {string} email
 * @returns {string|Object}
 */
export function askNewPassword(email) {
  return async function () {
    try {
      const success = await callApi.get(`/users/ask-new-password/${email}`);
      return success.data;
    } catch (error) {
      return error.response;
    }
  };
}

/**
 * @name saveNewPassword
 * @param {string} token
 * @param {string} password
 * @returns {string|Object}
 */
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
  };
}
