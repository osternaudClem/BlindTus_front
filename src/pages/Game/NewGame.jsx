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
import { calculScore } from '../../lib/number';
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
  const [categories, setCategories] = useState([]);
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
    props.scoresActions.reset();
  }, [props.scoresActions]);

  useEffect(() => {
    props.scoresActions.reset();
    if (code) {
      (async function () {
        try {
          const game = await props.gamesActions.getGame(code);
          if (game._id) {
            setTotalMusics(game.musics.length);
            setTimeLimit(game.round_time);
            setDifficulty(game.difficulty);
            return setGameWithCode(true);
          }
          navigate('/game');
        } catch (error) {
          navigate('/game');
        }
      })();
    }
  }, [props.scoresActions, props.gamesActions, code, navigate]);

  useEffect(() => {
    if (!inputDisabled && answerField.current) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  const getMusics = async function (limit, categories) {
    const allMusics = await props.musicsActions.getMusics(limit, categories);

    return allMusics;
  };

  useEffect(() => {
    const currentGame = props.games.currentGame;

    if (currentGame.proposals && musicNumber < totalMusics) {
      const music = currentGame.musics[musicNumber];
      setProposals(
        shuffle([
          music[music.movie ? 'movie' : 'tvShow'].title_fr,
          ...currentGame.proposals[musicNumber].slice(0, 7),
        ])
      );
    }
  }, [musicNumber, props.games.currentGame, totalMusics]);

  const onStartGame = async function ({
    time,
    movieNumber,
    difficulty,
    categories,
  }) {
    try {
      const musics = await getMusics(movieNumber, categories);

      console.log('>>> musics', musics);

      props.gamesActions.saveGame({
        round_time: time,
        difficulty,
        musics,
        categories,
        created_by: user._id,
      });

      setIsStarted(true);
      setDisplayTimer(true);
    } catch (error) {
      console.log('>>> error', error);
    }
  };

  const handleClickStart = function () {
    setIsStarted(true);
    setDisplayTimer(true);
  };

  const onSettingsSaved = function (settings) {
    setTimeLimit(settings.time);
    setDifficulty(settings.difficulty);
    setTotalMusics(settings.movieNumber);
    setCategories(settings.categories);

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
    const music = props.games.currentGame.musics[musicNumber];
    let score = 0;

    let isAnswerCorrect = false;

    if (
      (music.movie && music.movie.title_fr === answer) ||
      (music.tvShow && music.tvShow.title_fr === answer)
    ) {
      isAnswerCorrect = true;
    }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      score = calculScore(timeLeft, timeLimit);
    }

    setScore(score);

    saveScore(music, isAnswerCorrect, score);

    onTimerFinished(0, false);
  };

  const onSendAnswer = (event, timeOut = false) => {
    const music = props.games.currentGame.musics[musicNumber];

    let score = 0;

    if (event) {
      event.preventDefault();
    }

    if (inputDisabled) {
      return;
    }

    const titles =
      (music.movie && [
        music.movie.title,
        music.movie.title_fr,
        ...music.movie.simple_title,
      ]) ||
      (music.tvShow && [
        music.tvShow.title,
        music.tvShow.title_fr,
        ...music.tvShow.simple_title,
      ]);

    const isAnswerCorrect = checkSimilarity(answer, titles);

    setIsCorrect(isAnswerCorrect);

    if (!isAnswerCorrect && !timeOut) {
      window.setTimeout(() => {
        setIsCorrect(null);
      }, 500);
      return updateAnswer('');
    }

    if (isAnswerCorrect) {
      score = calculScore(timeLeft, timeLimit);
    }

    setScore(score);

    saveScore(music, isAnswerCorrect, score);

    onTimerFinished(0, false);
  };

  const saveScore = function (music, isAnswerCorrect, score) {
    props.scoresActions.addScore({
      movie: (music.movie && music.movie.title_fr) || null,
      tvShow: (music.tvShow && music.tvShow.title_fr) || null,
      isCorrect: isAnswerCorrect,
      score: Math.round(score),
      playerAnswer: answer,
      movie_id: (music.movie && music.movie._id) || null,
      show_id: (music.tvShow && music.tvShow._id) || null,
      music_id: music._id,
    });
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
          redirect="game"
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
        const musics = props.games.currentGame.musics[musicNumber - 1];
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

            <Result music={musics} />
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
