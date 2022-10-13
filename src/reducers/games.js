import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function gamesReducers(state = initialState.games, action) {
  switch (action.type) {
    case types.ADD_GAME_SUCCESS: {   
      return {
        ...state,
        currentGame: action.game,
      }
    }

    case types.GET_GAME_SUCCESS: {
      return {
        ...state,
        currentGame: action.game,
      }
    }

    case types.RESET_GAME_SUCCESS: {
      return {
        ...state,
        currentGame: {},
      }
    }
    
    default:
      return state;
  }
}