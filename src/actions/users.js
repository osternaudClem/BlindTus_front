import axios from 'axios';
import { api } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function login(email, password) {
  return async function (dispatch) {
    try {
      const success = await axios.post(`${API}/users/login`, {
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
      const success = await axios.post(`${API}/users/confirm`, {
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
      const success = await axios.get(`${API}/users/${user_id}`);
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
      const success = await axios.post(`${API}/users`, { ...user });     
      dispatch({ type: types.POST_USER_SUCCESS, user: success.data });
      return success.data;
    } catch (error) {
      console.log(error.response.data)
      return error.response.data;
    }
  }
}

export function updateUser(userId, update) {
  return async function () {
    try {
      const success = await axios.patch(`${API}/users/${userId}`, { ...update });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export function changePassword(userId, update) {
  return async function () {
    try {
      const success = await axios.patch(`${API}/users/changePassword/${userId}`, { ...update });
      return success.data;
    } catch (error) {
      return error.response.data;
    }
  }
}