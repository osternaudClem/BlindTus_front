import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Alert, AlertTitle, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

import { useTextfield } from '../../hooks/formHooks';
import { checkSimilarity } from '../../lib/check';
import { shuffle } from '../../lib/array';
import { calculScore } from '../../lib/number';

import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { MovieTextField } from '../../components/Forms';
import {
  GamePlayer,
  GameProposals,
  GameRoundResults,
} from '../../components/Game';
import { Heading, PaperBox } from '../../components/UI';

const STEPS = {
  ROUND_RESULT: 'round_result',
};

function Play({
  socket,
  room,
  players,
  isCreator,
  onAnswer,
  onEndGame,
  onStep,
}) {
  const [isInputDisable, setIsInputDisable] = useState(true);
  const [isAnswerSent, setIsAnswerSent] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isDisplayGame, setIsDisplayGame] = useState(false);
  const [isDisplayResult, setIsDisplayResult] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [timer, updateTimer] = useState(0);
  const [timeLeft, updateTimeLeft] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [proposals, setProposals] = useState([]);
  const [score, setScore] = useState(0);
  const answerField = useRef(null);

  useEffect(() => {
    if (!isInputDisable && answerField.current) {
      answerField.current.focus();
    }
  }, [isInputDisable]);

  useEffect(() => {
    if (isReady) {
      updateTimer(room.settings.time_limit);
    }
  }, [isReady, room.settings.time_limit]);

  useEffect(() => {
    socket.on('START_MUSIC', (room) => {
      if (room.step - 1 === room.settings.total_musics) {
        return onEndGame();
      }
      setIsCorrect(false);
      setIsInputDisable(true);
      setIsDisplayResult(false);
      setIsDisplayGame(true);
    });

    socket.on('IS_EVERYBODY_READY', ({ allReady }) => {
      if (allReady) {
        setIsReady(true);
        setIsInputDisable(false);
      }
    });

    socket.on('NEXT_ROUND', () => {
      onStep(STEPS.ROUND_RESULT);
      setIsDisplayGame(false);
      setIsInputDisable(true);
      setIsAnswerSent(false);
      setIsReady(false);
      updateTimer(0);
    });
  }, []);

  useEffect(() => {
    const { musics, step } = room;

    const currentStep = step - 1;

    if (musics[currentStep] && musics[currentStep].proposals) {
      setProposals(
        shuffle([
          musics[currentStep][musics[currentStep].movie ? 'movie' : 'tvShow']
            .title_fr,
          ...musics[currentStep].proposals.slice(0, 7),
        ])
      );
    }
  }, [room]);

  const onTimerFinished = function (count) {
    updateTimeLeft(count);

    if (count !== 0 || !isDisplayGame) {
      return;
    }

    setIsDisplayGame(false);
    setIsInputDisable(true);
    onSendAnswer(null, true);
    updateAnswer('');
    setIsAnswerSent(false);
  };

  const handleClickStartMusic = function () {
    socket.emit('ASK_START_MUSIC');
    onStep(null);
  };

  const onSendAnswer = (event, timeOut = false) => {
    const { musics, step } = room;
    const movie = musics[step - 1].movie;
    const tvShow = musics[step - 1].tvShow;
    let score = 0;

    if (event) {
      event.preventDefault();
    }

    if (isInputDisable) {
      return;
    }

    const titles =
      (movie && [movie.title, movie.title_fr, ...movie.simple_title]) ||
      (tvShow && [tvShow.title, tvShow.title_fr, ...tvShow.simple_title]);

    let isCorrect = checkSimilarity(answer, titles);

    if (!isCorrect && !timeOut) {
      updateAnswer('');
      return;
    }

    setIsCorrect(isCorrect);

    if (isCorrect) {
      score = calculScore(timeLeft, room.settings.time_limit);
    }

    setScore(score);

    onAnswer(score, step, answer);
    setIsAnswerSent(true);
    setIsDisplayResult(true);
    setIsInputDisable(true);
    updateAnswer('');
  };

  const handleClickAnswer = function (answer) {
    const { musics, settings, step } = room;
    const movie = musics[step - 1].movie;
    const tvShow = musics[step - 1].tvShow;
    let score = 0;
    let isCorrect = false;

    if (
      (movie && movie.title_fr === answer) ||
      (tvShow && tvShow.title_fr === answer)
    ) {
      isCorrect = true;
    }

    setIsCorrect(isCorrect);

    if (isCorrect) {
      score = calculScore(timeLeft, settings.time_limit);
    }

    setScore(score);
    onAnswer(score, step, answer);
    setIsAnswerSent(true);
    setIsDisplayResult(true);
  };

  const onLoading = useCallback(
    (loading) => {
      if (isReady) {
        return;
      }

      socket.emit('UPDATE_LOADING', loading);
    },
    [socket, isReady]
  );

  const onCanPlayAudio = function () {
    socket.emit('PLAYER_AUDIO_READY');
  };

  return (
    <div>
      <div>
        {room.step} / {room.musics.length}
      </div>

      <Timer
        limit={timer}
        onFinished={(count) => onTimerFinished(count)}
        key={timer}
        className="NewGame__timer"
      />

      <Typography
        variant="h5"
        mb={2}
      >
        Nous cherchons{' '}
        {!isDisplayGame
          ? '...'
          : (room.musics[room.step - 1] &&
              room.musics[room.step - 1].movie &&
              'un film !') ||
            (room.musics[room.step - 1] &&
              room.musics[room.step - 1].tvShow &&
              'une série !')}
      </Typography>

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
            disabled={isInputDisable}
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

  function renderPlayer() {
    if (!isDisplayGame) {
      return;
    }

    const { musics, step } = room;

    return (
      <GamePlayer
        audioName={musics[step - 1].audio_name}
        timecode={musics[step - 1].timecode}
        canPlay={onCanPlayAudio}
        onLoading={onLoading}
        isReady={isReady}
      />
    );
  }

  function renderStart() {
    if (isDisplayGame) {
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
        startIcon={
          room.step === room.settings.total_musics ? (
            <SportsScoreIcon />
          ) : (
            <PlayArrowIcon />
          )
        }
        sx={{ marginBottom: '16px' }}
      >
        {room.step === room.settings.total_musics
          ? 'Afficher les résultats'
          : 'Lancer la musique'}
      </Button>
    );
  }

  function renderProposals() {
    if (!isDisplayGame || isAnswerSent) {
      return;
    }

    return (
      <GameProposals
        proposals={proposals}
        onClick={handleClickAnswer}
      />
    );
  }

  function renderResult() {
    const { musics, step } = room;
    if (!isDisplayResult) {
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
          movie={musics[step - 1].movie}
          music={musics[step - 1]}
        />
      </React.Fragment>
    );
  }

  function renderRoundResults() {
    const { rounds, step } = room;

    if (!rounds[step - 1]) {
      return;
    }

    return (
      <PaperBox style={{ marginBottom: '16px' }}>
        <Heading type="subtitle">Résultat de la manche</Heading>
        <GameRoundResults
          room={room}
          players={players}
          round={step - 1}
        />
      </PaperBox>
    );
  }
}

export default Play;
