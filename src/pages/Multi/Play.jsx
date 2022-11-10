import React, { useEffect, useState, useRef } from 'react';
import { Box, Alert, AlertTitle, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

import { useTextfield } from '../../hooks/formHooks';
import { checkSimilarity } from '../../lib/check';
import { shuffle } from '../../lib/array';

import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { MovieTextField } from '../../components/Forms';
import {
  GamePlayer,
  GameProposals,
  GameRoundResults,
} from '../../components/Game';
import { Heading, PaperBox } from '../../components/UI';

const TIMER_GAME = 10;

function Play({
  socket,
  room,
  musics,
  isCreator,
  game,
  players,
  onAnswer,
  onEndGame,
}) {
  const [score, setScore] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [isReady, setIsReady] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_GAME);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isEndGame, setIsEndGame] = useState(false);
  const [answerSent, setAnswerSent] = useState(false);
  const answerField = useRef(null);

  useEffect(() => {
    if (!inputDisabled && answerField.current) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  useEffect(() => {
    if (isReady) {
      setTimer(room.settings.timeLimit);
    }
  }, [isReady, room.settings.timeLimit]);

  useEffect(() => {
    let nexMusicNumber = 0;
    let endGame = false;

    socket.on('NEXT_ROUND', ({ step, isEndGame }) => {
      endGame = isEndGame;
      nexMusicNumber = step;
      setDisplayGame(false);
      setAnswerSent(false);
      setTimer(0);
      setIsEndGame(isEndGame);
      setIsReady(false);

      return () => {
        socket.off('NEXT_ROUND');
      };
    });

    socket.on('START_MUSIC', () => {
      if (endGame) {
        setDisplayGame(false);
        setIsEndGame(false);
        setMusicsNumber(0);
        onEndGame();
      }

      setDisplayResult(false);
      setInputDisabled(false);
      setMusicsNumber(nexMusicNumber);
      setIsCorrect(null);
      setDisplayGame(true);
    });

    socket.on('IS_EVERYBODY_READY', ({ isReadyToPlay }) => {
      setIsReady(isReadyToPlay);
    });

    return () => {
      endGame = false;
      nexMusicNumber = 0;
      setIsEndGame(false);
      setMusicsNumber(0);

      socket.off('NEXT_ROUND');
      socket.off('START_MUSIC');
      socket.off('IS_EVERYBODY_READY');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (musics[musicNumber].proposals && musicNumber < musics.length) {
      setProposals(
        shuffle([
          musics[musicNumber].movie.title_fr,
          ...musics[musicNumber].proposals.slice(0, 7),
        ])
      );
    }
  }, [musicNumber, musics]);

  const onTimerFinished = function (count, sending = true) {
    setTimeLeft(count);

    if (count === 0 && displayGame) {
      if (sending) {
        onSendAnswer(null, true);
      }
      setDisplayGame(false);
      setInputDisabled(true);
      updateAnswer('');
      setAnswerSent(false);
    }
  };

  const handleClickStartMusic = function () {
    socket.emit('ASK_START_MUSIC');
  };

  const onSendAnswer = (event, timeOut = false) => {
    const music = musicNumber;
    const movie = musics[music].movie;
    let score = 0;

    if (event) {
      event.preventDefault();
    }

    if (inputDisabled) {
      return;
    }

    let titles = [movie.title, movie.title_fr, ...movie.simple_title];

    let isCorrect = checkSimilarity(answer, titles);

    if (!isCorrect && !timeOut) {
      updateAnswer('');
      return;
    }

    setIsCorrect(isCorrect);

    if (isCorrect) {
      score = (timeLeft * 100) / room.settings.timeLimit;
    }

    setScore(score);

    onAnswer(score, musicNumber, answer);
    setAnswerSent(true);
    setDisplayResult(true);
    setInputDisabled(true);
    updateAnswer('');
  };

  const handleClickAnswer = function (answer) {
    const music = musicNumber;
    const movie = musics[music].movie;
    let score = 0;
    let isCorrect = false;

    if (answer === movie.title_fr) {
      isCorrect = true;
    }

    setIsCorrect(isCorrect);

    if (isCorrect) {
      score = Math.round((timeLeft * 100) / room.settings.timeLimit / 10);
    }

    setScore(score);
    onAnswer(score, musicNumber, answer);
    setAnswerSent(true);
    setDisplayResult(true);
  };

  const onCanPlayAudio = function () {
    socket.emit('PLAYER_AUDIO_READY');
  };

  return <div>{renderGame()}</div>;

  function renderGame() {
    if (!musics || musics.length === 0) {
      return;
    }

    return (
      <div>
        <div>
          {musicNumber + 1} / {musics.length}
        </div>

        <Timer
          limit={timer}
          onFinished={(count) => onTimerFinished(count)}
          key={timer}
          className="NewGame__timer"
        />

        {renderPlayer()}

        {room.settings.difficulty === 'difficult' ? (
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
          <div>{renderProposals()}</div>
        )}
        {renderStart()}
        {renderResult()}
      </div>
    );
  }

  function renderStart() {
    if (displayGame) {
      return;
    }

    if (!isCreator) {
      return (
        <Alert
          variant="outlined"
          severity="info"
          icon={false}
          sx={{ marginBottom: '16px' }}
        >
          En attente du Maître du jeu...
        </Alert>
      );
    }

    return (
      <Button
        onClick={handleClickStartMusic}
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
    console.log('>>> room', room);
    console.log('>>> game', game);
    if (!displayGame || answerSent) {
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
    if (!displayGame) {
      return;
    }

    return (
      <GamePlayer
        audioName={musics[musicNumber].audio_name}
        timecode={musics[musicNumber].timecode}
        canPlay={onCanPlayAudio}
        isReady={isReady}
      />
    );
  }

  function renderResult() {
    if (musicNumber < 0 || !displayResult) {
      return;
    }

    return (
      <React.Fragment>
        <Alert
          variant="outlined"
          icon={false}
          severity={isCorrect ? 'success' : 'error'}
          sx={{ marginBottom: '16px' }}
        >
          <AlertTitle>Réponse {isCorrect ? 'correct' : 'fausse'} !</AlertTitle>+{' '}
          {Math.round(score)} points !
        </Alert>

        {renderRoundResults()}

        <Result
          movie={musics[musicNumber].movie}
          music={musics[musicNumber]}
        />
      </React.Fragment>
    );
  }

  function renderRoundResults() {
    if (!game.rounds[musicNumber]) {
      return;
    }

    return (
      <PaperBox style={{ marginBottom: '16px' }}>
        <Heading type="subtitle">Résultat de la manche</Heading>
        <GameRoundResults
          game={game}
          players={players}
          musicNumber={musicNumber}
        />
      </PaperBox>
    );
  }
}

export default Play;
