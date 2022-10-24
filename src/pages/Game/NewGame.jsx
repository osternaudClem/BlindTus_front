import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  CssBaseline,
  Grid,
  Box,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import {
  musicsActions,
  scoresActions,
  gamesActions,
  historyActions,
} from '../../actions';
import { shuffle } from '../../lib/array';
import { checkSimilarity } from '../../lib/check';
import { updateTitle } from '../../lib/document';
import { GamePlayer } from '../../components/Game';
import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { Scores } from '../../components/Scores';
import { GameProposals } from '../../components/Game';
import {
  GameSettings,
  GameSettingsResume,
  MovieTextField,
} from '../../components/Forms';
import { Heading } from '../../components/UI';
import { useTextfield } from '../../hooks/formHooks';
import { UserContext } from '../../contexts/userContext';
import '../Page.scss';

// const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function NewGame(props) {
  const [isStarted, setIsStarted] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [isCorrect, setIsCorrect] = useState(null);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIMER_GAME);
  const [timeLimit, setTimeLimit] = useState(TIMER_GAME);
  const [difficulty, setDifficulty] = useState('easy');
  const [totalMusics, setTotalMusics] = useState(5);
  const [gameWithCode, setGameWithCode] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [score, setScore] = useState(0);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');
  const answerField = useRef(null);

  useEffect(() => {
    updateTitle('Nouvelle partie');
  }, []);

  useEffect(() => {
    props.scoresActions.reset();
    if (code) {
      (async function () {
        try {
          const game = await props.gamesActions.getGame(code);
          if (game._id) {
            return setGameWithCode(true);
          }
          navigate('/game');
        } catch (error) {
          navigate('/game');
        }
      })();
    }

    return () => {
      props.gamesActions.reset();
    };
  }, [props.scoresActions, props.gamesActions, code, navigate]);

  useEffect(() => {
    if (!inputDisabled && answerField.current) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  const getMusics = async function (limit) {
    const allMusics = await props.musicsActions.getMusics(limit);

    return allMusics;
  };

  useEffect(() => {
    const currentGame = props.games.currentGame;

    if (currentGame.proposals && musicNumber < totalMusics) {
      setProposals(
        shuffle([
          currentGame.musics[musicNumber].movie.title_fr,
          ...currentGame.proposals[musicNumber].slice(0, 7),
        ])
      );
    }
  }, [musicNumber, props.games.currentGame, totalMusics]);

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
  };

  const handleClickStart = function () {
    setIsStarted(true);
    setDisplayTimer(true);
  };

  const onSettingsSaved = function (settings) {
    setTimeLimit(settings.time);
    setDifficulty(settings.difficulty);
    setTotalMusics(settings.movieNumber);

    onStartGame(settings);
  };

  function onTimerFinished(count, sending = true) {
    setTimeLeft(count);
    if (count === 0 && displayGame) {
      if (sending) {
        onSendAnswer(null, true);
      }

      setTimer(0);
      setDisplayGame(false);
      setInputDisabled(true);
      setMusicsNumber(musicNumber + 1);
      updateAnswer('');

      if (musicNumber >= totalMusics - 1) {
        props.historyActions.saveHistory({
          scores: props.scores.currentGame,
          user: user,
          game: props.games.currentGame,
        });
        setIsEndGame(true);
      }
    }
  }

  const handleClickShowResults = function () {
    navigate('/game/end');
  };

  const handleClickStartMusic = function () {
    setInputDisabled(false);
    setTimer(timeLimit);
    setIsCorrect(null);
    setDisplayGame(true);
  };

  const handleClickAnswer = function (answer) {
    const music = musicNumber;
    const movie = props.games.currentGame.musics[music].movie;
    let score = 0;

    let isAnswerCorrect = false;

    if (answer === movie.title_fr) {
      isAnswerCorrect = true;
    }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      score = (timeLeft * 100) / timeLimit;
    }

    setScore(score);

    props.scoresActions.addScore({
      movie: movie.title_fr,
      isCorrect: isAnswerCorrect,
      score: Math.round(score),
      playerAnswer: answer,
      movie_id: props.games.currentGame.musics[music].movie._id,
      music_id: props.games.currentGame.musics[music]._id,
    });

    onTimerFinished(0, false);
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

    let titles = [movie.title, movie.title_fr, ...movie.simple_title];

    const isAnswerCorrect = checkSimilarity(answer, titles);

    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect && !timeOut) {
      window.setTimeout(() => {
        setIsCorrect(null);
      }, 500);
      return updateAnswer('');
    }

    if (isAnswerCorrect) {
      score = (timeLeft * 100) / timeLimit;
    }

    setScore(score);

    props.scoresActions.addScore({
      movie: movie.title_fr,
      isCorrect: isAnswerCorrect,
      score: Math.round(score),
      playerAnswer: answer,
      movie_id: props.games.currentGame.musics[music].movie._id,
      music_id: props.games.currentGame.musics[music]._id,
    });

    onTimerFinished(0, false);
  };

  return (
    <Grid
      container
      spacing={12}
      component="main"
      className="LoginPage"
    >
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={isStarted ? 6 : 12}
        md={8}
      >
        {renderButton()}
        {game()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
      >
        {isStarted && <Scores />}
      </Grid>
    </Grid>
  );

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
      <div>
        <Heading>Nouvelle partie</Heading>
        <GameSettings
          onSettingsSaved={onSettingsSaved}
          redirect="new-game"
        />
      </div>
    );
  }

  function game() {
    if (
      !isStarted ||
      !props.games.currentGame.musics ||
      props.games.currentGame.musics.length === 0
    ) {
      return;
    }

    return (
      <div>
        <div>
          {musicNumber} / {props.games.currentGame.musics.length}
        </div>

        {renderTimer()}

        {difficulty === 'difficult' ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
            }}
            mb={4}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={(event) => onSendAnswer(event)}
          >
            <MovieTextField
              onChange={updateAnswer}
              value={answer}
              disabled={inputDisabled}
              inputRef={answerField}
              isCorrect={isCorrect}
            />
          </Box>
        ) : (
          renderProposals()
        )}

        {renderStart()}

        {renderPlayer()}
      </div>
    );
  }

  function renderStart() {
    if (displayGame && !isEndGame) {
      return;
    }

    return (
      <Button
        onClick={isEndGame ? handleClickShowResults : handleClickStartMusic}
        variant="contained"
        size="large"
        startIcon={isEndGame ? <SportsScoreIcon /> : <PlayArrowIcon />}
        sx={{ marginBottom: '16px' }}
      >
        {isEndGame ? 'Afficher les résultats' : 'Lancer la musique'}
      </Button>
    );
  }

  function renderProposals() {
    if (!displayGame || isEndGame) {
      return;
    }

    return (
      <GameProposals
        proposals={proposals}
        onClick={handleClickAnswer}
      />
    );
  }

  function renderPlayer() {
    if (!displayGame || isEndGame) {
      if (musicNumber > 0) {
        return (
          <React.Fragment>
            <Alert
              variant="outlined"
              icon={false}
              severity={isCorrect ? 'success' : 'error'}
              sx={{ marginBottom: '16px' }}
            >
              <AlertTitle>
                Réponse {isCorrect ? 'correct' : 'fausse'} !
              </AlertTitle>
              + {Math.round(score)} points !
            </Alert>

            <Result
              movie={props.games.currentGame.musics[musicNumber - 1].movie}
              music={props.games.currentGame.musics[musicNumber - 1]}
            />
          </React.Fragment>
        );
      }
      return;
    }

    const music = props.games.currentGame.musics[musicNumber];

    return (
      <GamePlayer
        audioName={music.audio_name}
        timecode={music.timecode}
      />
    );
  }

  function renderTimer() {
    if (!displayTimer) {
      return;
    }

    return (
      <div>
        <Timer
          limit={timer}
          onFinished={(count) => onTimerFinished(count)}
          key={timer}
          className="NewGame__timer"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
    scores: state.scores,
    games: state.games,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
    scoresActions: bindActionCreators(scoresActions, dispatch),
    gamesActions: bindActionCreators(gamesActions, dispatch),
    historyActions: bindActionCreators(historyActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
