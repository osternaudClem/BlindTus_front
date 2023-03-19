import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Grid,
  Box,
  Alert,
  AlertTitle,
  Button,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

import { shuffle } from '../../lib/array';
import { checkSimilarity } from '../../lib/check';
import { updateTitle } from '../../lib/document';
import { calculScore } from '../../lib/number';
import { GamePlayer } from '../../components/Game';
import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { ScoresContainer } from '../../components/Scores';
import { GameProposals } from '../../components/Game';
import {
  GameSettingsContainer,
  GameSettingsResumeContainer,
  MovieTextField,
} from '../../components/Forms';
import { Heading } from '../../components/UI';
import { useTextfield } from '../../hooks/formHooks';
import '../Page.scss';

// const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function NewGame({
  game,
  currentGame,
  currentGameScores,
  getMusics,
  onSaveGame,
  onSaveHistory,
  onSaveScore,
}) {
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
  const [, setCategories] = useState([]);
  const [gameWithCode, setGameWithCode] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');
  const answerField = useRef(null);

  useEffect(() => {
    updateTitle('Nouvelle partie');
  }, []);

  useEffect(() => {
    if (code) {
      if (game._id) {
        setTotalMusics(game.musics.length);
        setTimeLimit(game.round_time);
        setDifficulty(game.difficulty);
        return setGameWithCode(true);
      }
      navigate('/game');
    }
  }, [code, currentGame, currentGame, navigate]);

  useEffect(() => {
    if (!inputDisabled && answerField.current) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  useEffect(() => {
    if (game.proposals && musicNumber < totalMusics) {
      const music = game.musics[musicNumber];
      setProposals(
        shuffle([
          music[music.movie ? 'movie' : 'tvShow'].title_fr,
          ...game.proposals[musicNumber].slice(0, 7),
        ])
      );
    }
  }, [musicNumber, totalMusics, game]);

  useEffect(() => {
    if (musicNumber > totalMusics - 1) {
      onSaveHistory();
      setIsEndGame(true);
    }
  }, [totalMusics, musicNumber, onSaveHistory]);

  const saveScore = useCallback(
    (music, isAnswerCorrect, score) => {
      onSaveScore(music, isAnswerCorrect, score, answer);
    },
    [answer, currentGame, onSaveScore]
  );

  const onStartGame = async function ({
    time,
    movieNumber,
    difficulty,
    categories,
    musics,
  }) {
    try {
      const musics = await getMusics(movieNumber, categories);
      onSaveGame({
        time,
        difficulty,
        categories,
        musics,
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

  const onSendAnswer = useCallback(
    (event, timeOut = false) => {
      const music = currentGame.musics[musicNumber];

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      answer,
      currentGame.musics,
      inputDisabled,
      musicNumber,
      saveScore,
      timeLeft,
      timeLimit,
      updateAnswer,
    ]
  );

  const onTimerFinished = useCallback(
    (count, sending = true) => {
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
      }
    },
    [displayGame, musicNumber, onSendAnswer, updateAnswer]
  );

  const handleClickShowResults = useCallback(() => {
    navigate('/game/end');
  }, [navigate]);

  const handleClickStartMusic = useCallback(() => {
    setInputDisabled(false);
    setTimer(timeLimit);
    setIsCorrect(null);
    setDisplayGame(true);
  }, [timeLimit]);

  const handleClickAnswer = useCallback(
    (answer) => {
      const music = currentGame.musics[musicNumber];
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
    },
    [
      currentGame.musics,
      musicNumber,
      onTimerFinished,
      saveScore,
      timeLeft,
      timeLimit,
    ]
  );

  const renderStart = useCallback(() => {
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
  }, [displayGame, handleClickShowResults, handleClickStartMusic, isEndGame]);

  const renderProposals = useCallback(() => {
    if (!displayGame || isEndGame) {
      return;
    }

    return (
      <GameProposals
        proposals={proposals}
        onClick={handleClickAnswer}
      />
    );
  }, [displayGame, handleClickAnswer, isEndGame, proposals]);

  const renderPlayer = useCallback(() => {
    if (!displayGame || isEndGame) {
      if (musicNumber > 0) {
        const music = currentGame.musics[musicNumber - 1];
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

            <Result music={music} />
          </React.Fragment>
        );
      }
      return;
    }

    const music = currentGame.musics[musicNumber];

    return (
      <GamePlayer
        audioName={music.audio_name}
        timecode={music.timecode}
      />
    );
  }, [
    currentGame.musics,
    displayGame,
    isCorrect,
    isEndGame,
    musicNumber,
    score,
  ]);

  const renderTimer = useCallback(() => {
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
  }, [displayTimer, onTimerFinished, timer]);

  const gameStep = useCallback(() => {
    if (!isStarted || !currentGame.musics || currentGame.musics.length === 0) {
      return;
    }
    const music = game.musics[musicNumber];

    return (
      <div>
        <div>
          {musicNumber} / {game.musics.length}
        </div>

        {renderTimer()}

        <Typography
          variant="h5"
          mb={2}
        >
          Nous cherchons{' '}
          {!displayGame
            ? '...'
            : (music && music.movie && 'un film !') ||
              (music && music.tvShow && 'une série !')}
        </Typography>

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
  }, [
    answer,
    currentGame.musics,
    difficulty,
    displayGame,
    inputDisabled,
    isCorrect,
    isStarted,
    musicNumber,
    onSendAnswer,
    renderPlayer,
    renderProposals,
    renderStart,
    renderTimer,
    updateAnswer,
  ]);

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
        {gameStep()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
      >
        {isStarted && currentGame._id && (
          <ScoresContainer
            currentGame={currentGame}
            currentGameScores={currentGameScores}
          />
        )}
      </Grid>
    </Grid>
  );

  function renderButton() {
    if (isStarted) {
      return;
    }

    if (gameWithCode) {
      return (
        <GameSettingsResumeContainer
          game={currentGame}
          displayStart
          code={code}
          onClickStart={handleClickStart}
        />
      );
    }

    return (
      <div>
        <Heading>Nouvelle partie</Heading>
        <GameSettingsContainer
          onSettingsSaved={onSettingsSaved}
          redirect="game"
        />
      </div>
    );
  }
}

export default NewGame;
