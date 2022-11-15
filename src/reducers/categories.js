import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function categoriesReducers(
  state = initialState.categories,
  action
) {
  switch (action.type) {
    case types.GET_CATEGORIES_SUCCESS: {
      const categories = action.categories;

      return {
        ...state,
        all: categories,
      };
    }

    default:
      return state;
  }
}
