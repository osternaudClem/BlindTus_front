import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import stringSimilarity from 'string-similarity';
import {
  CssBaseline,
  Grid,
  Box,
  Paper,
  Typography,
} from '@mui/material';

import {
  musicsActions,
  scoresActions,
  gameSettingsActions,
  gamesActions,
  historyActions,
} from '../actions';

import { Player } from '../components/Player';
import { Timer } from '../components/Timer';
import { Result } from '../components/Results';
import { Scores } from '../components/Scores';
import { GameSettings, GameSettingsResume, MovieTextField } from '../components/Forms';
import { useTextfield } from '../hooks/formHooks';
import { UserContext } from '../contexts/userContext';
import './Page.scss';

const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function NewGame(props) {
  const [isStarted, setIsStarted] = useState(false);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [isCorrect, setIsCorrect] = useState(null);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [timer, setTimer] = useState(TIMER_PENDING);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIMER_GAME);
  const [timeLimit, setTimeLimit] = useState(TIMER_GAME);
  const [difficulty, setDifficulty] = useState('easy');
  const [totalMusics, setTotalMusics] = useState(5);
  const [gameWithCode, setGameWithCode] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');
  const answerField = useRef(null);

  useEffect(() => {
    props.scoresActions.reset();
    if (code) {
      (async function () {
        try {
          const game = await props.gamesActions.getGame(code);
          if (game._id) {
            return setGameWithCode(true);
          }
          navigate('/new-game');
        } catch (error) {
          navigate('/new-game')
        }
      })();
    }

  }, [props.scoresActions, props.gamesActions, code, navigate]);

  useEffect(() => {
    if (!inputDisabled) {
      answerField.current.focus();
    }
  }, [inputDisabled])

  const getMusics = async function (limit) {
    if (props.musics.selection.length > 0) {
      return;
    }

    return await props.musicsActions.getMusics(limit);
  }

  const onStartGame = async function ({ time, movieNumber, difficulty }) {
    const musics = await getMusics(movieNumber);

    props.gamesActions.saveGame({
      round_time: time,
      difficulty,
      musics,
      created_by: user._id,
    });

    setIsStarted(true);
    setDisplayTimer(true);
  }

  const handleClickStart = function () {
    setIsStarted(true);
    setDisplayTimer(true);
  }

  const onSettingsSaved = function (settings) {
    setTimeLimit(settings.time);
    setDifficulty(settings.difficulty);
    setTotalMusics(settings.movieNumber);

    onStartGame(settings);
  }

  function onTimerFinished(count, sending = true) {
    setTimeLeft(count);
    if (count === 0) {
      if (musicNumber >= totalMusics) {
        props.historyActions.saveHistory({
          scores: props.scores.currentGame,
          user: user,
          game: props.games.currentGame,
        })
        navigate('/end-game');
        return;
      }

      if (displayGame) {
        if (sending) {
          onSendAnswer(null, true);
        }
        setTimer(TIMER_PENDING);
        setDisplayGame(false);
        setInputDisabled(true);
        setMusicsNumber(musicNumber + 1);
        updateAnswer('');
      } else {
        setInputDisabled(false);
        setTimer(timeLimit);
        setIsCorrect(null);
        setDisplayGame(true);
      }
    }
  };

  const onSendAnswer = (event, timeOut = false) => {
    const music = musicNumber;
    const movie = props.games.currentGame.musics[music].movie;
    let score = 0;

    if (event) {
      event.preventDefault();
    }

    if (inputDisabled) {
      return;
    }

    let titles = [movie.title, movie.title_fr];

    if (difficulty === 'easy') {
      titles = [...titles, ...movie.simple_title];
    }

    let isAnswerCorrect = false;

    titles.map(title => {
      const similarity = stringSimilarity.compareTwoStrings(title.toLowerCase(), answer.toLowerCase());

      if (similarity >= 0.8) {
        isAnswerCorrect = true;
      }

      return null;
    });

    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect && !timeOut) {
      // setIsCorrect(null);
      window.setTimeout(() => {
        setIsCorrect(null);
      }, 500)
      return updateAnswer('');
    }

    if (isAnswerCorrect) {
      score = timeLeft * 100 / timeLimit;
    }

    props.scoresActions.addScore({
      movie: movie.title_fr,
      isCorrect: isAnswerCorrect,
      score: Math.round(score),
      playerAnswer: answer,
      movie_id: props.games.currentGame.musics[music].movie._id,
      music_id: props.games.currentGame.musics[music]._id,
    });

    onTimerFinished(0, false);
  }

  return (
    <Grid container spacing={12} component="main" className="LoginPage">
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={9}
        md={8}
      >
        {renderButton()}
        {game()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={4}
      >
        {isStarted &&
          <Scores />
        }
      </Grid>
    </Grid>
  )

  function renderButton() {
    if (isStarted) {
      return;
    }

    if (gameWithCode) {
      return (
        <GameSettingsResume
          game={props.games.currentGame}
          displayStart
          code={code}
          onClickStart={handleClickStart}
        />
      );
    }

    return (
      <Paper elevation={2} sx={{ padding: '2rem' }}>
        <Typography component="h2" variant="h3" gutterBottom>Nouvelle partie</Typography>
        <GameSettings onSettingsSaved={onSettingsSaved} redirect="new-game" />
      </Paper>
    );
  }

  function game() {
    if (!isStarted || !props.games.currentGame.musics || props.games.currentGame.musics.length === 0) {
      return;
    }

    return (
      <div>
        <div>{musicNumber} / {props.games.currentGame.musics.length}</div>

        {renderTimer()}

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
          mb={4}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={event => onSendAnswer(event)}
        >
          <MovieTextField
            onChange={updateAnswer}
            value={answer}
            disabled={inputDisabled}
            inputRef={answerField}
            isCorrect={isCorrect}
          />
        </Box>

        {renderPlayer()}
      </div>
    );
  }

  function renderPlayer() {
    if (!displayGame) {
      if (musicNumber > 0) {
        return (
          <Result movie={props.games.currentGame.musics[musicNumber - 1].movie} music={props.games.currentGame.musics[musicNumber - 1]} />
        )
      }
      return;
    }

    return (
      <Player url={props.games.currentGame.musics[musicNumber].video} />
    );
  }

  function renderTimer() {
    if (!displayTimer) {
      return;
    }

    return (
      <div>
        <Typography>
          {!displayGame ? 'Prochaine manche dans...' : 'Trouvez le nom du film...'}
        </Typography>
        <Timer limit={timer} onFinished={(count) => onTimerFinished(count)} key={timer} className="NewGame__timer" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
    scores: state.scores,
    games: state.games,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
    scoresActions: bindActionCreators(scoresActions, dispatch),
    gameSettingsActions: bindActionCreators(gameSettingsActions, dispatch),
    gamesActions: bindActionCreators(gamesActions, dispatch),
    historyActions: bindActionCreators(historyActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame)