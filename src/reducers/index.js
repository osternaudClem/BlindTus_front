import { combineReducers } from 'redux';
import musics from './musics';
import users from './users';
import scores from './scores';
import history from './history';
import games from './games';
import movies from './movies';
import today from './today';
import historyToday from './historyToday';
import tvShows from './tvShows';
import categories from './categories';

export default combineReducers({
  musics,
  users,
  scores,
  history,
  games,
  movies,
  today,
  historyToday,
  tvShows,
  categories,
});
