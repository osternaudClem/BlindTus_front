import { useEffect, useState, useRef } from 'react';
import {
  Box,
} from '@mui/material';

import { useTextfield } from '../../hooks/formHooks';
import { checkSimilarity } from '../../lib/check';
import { shuffle } from '../../lib/array';

import { Player } from '../../components/Player';
import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { MovieTextField } from '../../components/Forms';
import { GameProposals } from '../../components/Game';

const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function Play({ socket, room, musics, onAnswer, onEndGame }) {
  const [answer, updateAnswer] = useTextfield();
  const [isCorrect, setIsCorrect] = useState(null);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [nextMusicNumber, setNextMusicNumber] = useState(0);
  const [timer, setTimer] = useState(TIMER_PENDING);
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
    socket.on('NEXT_ROUND', ({ step, isEndGame }) => {
      setDisplayResult(true);
      setDisplayGame(false);
      setAnswerSent(false);
      setTimer(TIMER_PENDING);
      setNextMusicNumber(step);
      setIsEndGame(isEndGame);
    });
  }, [musicNumber, socket]);

  useEffect(() => {
    if (musics[musicNumber].proposals && musicNumber < musics.length) {
      setProposals(shuffle([musics[musicNumber].movie.title_fr, ...musics[musicNumber].proposals.slice(0, 7)]));
    }
  }, [musicNumber, musics]);

  const onTimerFinished = function (count, sending = true) {
    setTimeLeft(count);

    if (count === 0) {
      if (displayGame) {
        if (sending) {
          onSendAnswer(null, true);
        }
        setDisplayGame(false);
        setInputDisabled(true);
        updateAnswer('');
        setAnswerSent(false);
      }
      else {
        if (isEndGame) {
          onEndGame();
        }
        setMusicsNumber(parseInt(nextMusicNumber));
        setDisplayResult(false);
        setInputDisabled(false);
        setTimer(room.settings.timeLimit);
        setIsCorrect(null);
        setDisplayGame(true);
      }
    }
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
      score = timeLeft * 100 / room.settings.timeLimit;
    }

    onAnswer(score, musicNumber);
    setAnswerSent(true);
    setDisplayResult(true);
    setInputDisabled(true);
    updateAnswer('');
  }

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
      score = timeLeft * 100 / room.settings.timeLimit;
    }

    onAnswer(score, musicNumber);
    setAnswerSent(true);
    setDisplayResult(true);
  }

  return (
    <div>
      {renderGame()}
    </div>

  )

  function renderGame() {
    if (!musics || musics.length === 0) {
      return;
    }

    return (
      <div>
        <div>{musicNumber + 1} / {musics.length}</div>

        <Timer limit={timer} onFinished={(count) => onTimerFinished(count)} key={timer} className="NewGame__timer" />

        {room.settings.difficulty === 'difficult'
          ? (

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
          )
          : renderProposals()
        }

        {renderResult()}
        {renderPlayer()}
      </div>
    );
  }

  function renderProposals() {
    if (!displayGame || answerSent) {
      return;
    }

    return <GameProposals proposals={proposals} onClick={handleClickAnswer} />;
  }

  function renderPlayer() {
    if (!displayGame) {
      return;
    }

    return (
      <Player url={musics[musicNumber].video} />
    );
  }

  function renderResult() {
    if (musicNumber < 0 || !displayResult) {
      return;
    }

    return (
      <Result movie={musics[musicNumber].movie} music={musics[musicNumber]} />
    )
  }

}

export default Play;

