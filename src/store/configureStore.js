import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from '../reducers';

let middleware = [thunk];

if (false) {
  const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
  middleware = [...middleware, reduxImmutableStateInvariant, logger];
} else {
  middleware = [...middleware];
}

export default function configureStore(initialState) {
  return createStore(reducer, initialState, applyMiddleware(...middleware));
}