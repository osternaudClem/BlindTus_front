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
    cover: null,
  },
  scores: {
    currentGame: [],
  },
  gameSettings: {
    timeLimit: 30,
    difficulty: 'easy',
    totalMusic: 5,
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
