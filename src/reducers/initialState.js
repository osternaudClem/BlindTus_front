const state = Object.freeze({
  musics: {
    selection: [],
    all: [],
  },
  today: {
    game: null,
  },
  users: {
    me: {},
  },
  movies: {
    all: [],
    search: [],
    selected: {},
    cover: null,
  },
  tvShows: {
    all: [],
    search: [],
    selected: {},
  },
  scores: {
    currentGame: [],
  },
  history: {
    all: [],
  },
  games: {
    currentGame: {},
  },
  historyToday: {
    today: {},
    all: [],
  },
  categories: {
    all: [],
  },
  notifications: {
    all: [],
  },
});

export default state;
