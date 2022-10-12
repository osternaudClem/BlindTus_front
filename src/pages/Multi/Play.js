import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import stringSimilarity from 'string-similarity';
import {
  Box,
  TextField,
} from '@mui/material';

import { socket } from '../../contexts/socket';

import { Player } from '../../components/Player';
import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { useTextfield } from '../../hooks/formHooks';
const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function Play({ room, musics, onAnswer, onEndGame }) {
  const [answer, updateAnswer] = useTextfield();
  const [isCorrect, setIsCorrect] = useState(null);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [nextMusicNumber, setNextMusicNumber] = useState(0);
  const [displayTimer, setDisplayTimer] = useState(true);
  const [timer, setTimer] = useState(TIMER_PENDING);
  const [timeLeft, setTimeLeft] = useState(TIMER_GAME);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [answerSent, setAnswerSent] = useState(false);
  const answerField = useRef(null);

  useEffect(() => {
    if (!inputDisabled) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  useEffect(() => {
    socket.on('NEXT_ROUND', ({ step, game, isEndGame }) => {
      setDisplayResult(true);
      setDisplayGame(false);
      setTimer(TIMER_PENDING);
      setNextMusicNumber(step);
      setIsEndGame(isEndGame);
    });
  }, [musicNumber]);

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

    let titles = [movie.title, movie.title_fr];

    if (room.settings.difficulty === 'easy') {
      titles = [...titles, ...movie.simple_title];
    }

    let isCorrect = false;

    titles.map(title => {
      const similarity = stringSimilarity.compareTwoStrings(title.toLowerCase(), answer.toLowerCase());

      if (similarity >= 0.8) {
        isCorrect = true;
      }

      return null;
    });

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

  return (
    <div>
      {renderGame()}
    </div>

  )

  function renderGame() {
    if (!musics || musics.length === 0) {
      return;
    }

    let color = "primary";

    if (isCorrect) {
      color = "success";
    } else if (isCorrect !== null) {
      color = "error";
    }

    return (
      <div>
        <div>{musicNumber + 1} / {musics.length}</div>

        {displayTimer &&
          <Timer limit={timer} onFinished={(count) => onTimerFinished(count)} key={timer} className="NewGame__timer" />
        }
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
          <TextField
            onChange={updateAnswer}
            value={answer}
            placeholder="Tape le nom du film"
            fullWidth
            autoFocus
            color={color}
            disabled={inputDisabled}
            inputRef={answerField}
            InputProps={{
              style: { height: '80px', fontSize: '24px' }
            }}
          />
        </Box>
        {renderResult()}
        {renderPlayer()}
      </div>
    );
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

