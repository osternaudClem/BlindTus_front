import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

// Find categories
export function getCategories() {
  return async function (dispatch) {
    try {
      const success = await callApi.get('/categories');
      dispatch({
        type: types.GET_CATEGORIES_SUCCESS,
        categories: success.data,
      });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}
