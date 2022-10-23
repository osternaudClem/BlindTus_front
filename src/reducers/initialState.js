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
});

export default state;
