import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function scoresReducers(state = initialState.scores, action) {
  switch (action.type) {
    case types.ADD_SCORE_SUCCESS: {
      console.log('>>> action', action);
      const scores = [...state.currentGame];
      scores.push(action.score);

      return {
        ...state,
        currentGame: scores,
      };
    }

    case types.RESET_SCORE_SUCCESS: {
      return {
        ...state,
        currentGame: [],
      };
    }

    default:
      return state;
  }
}
