import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/youtube';
import stringSimilarity from 'string-similarity';
import {
  Box,
  CssBaseline,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

import { socket } from '../../context/socket';
import { Player } from '../../components/Player';
import { Timer } from '../../components/Timer';
import { Result } from '../../components/Results';
import { useTextfield } from '../../hooks/formHooks';

const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function Play(props) {
  const [game, setGame] = useState({});
  const [answer, updateAnswer] = useTextfield();
  const [isCorrect, setIsCorrect] = useState(null);
  const [room, setRoom] = useState(null);
  const [musics, setMusics] = useState(null);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [nextMusicNumber, setNextMusicNumber] = useState(0);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [timer, setTimer] = useState(TIMER_PENDING);
  const [timeLeft, setTimeLeft] = useState(TIMER_GAME);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayResult, setDisplayResult] = useState(false);
  const [isEndGame, setEndGame] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const answerField = useRef(null);

  useEffect(() => {
    if (!props.user.username) {
      return;
    }

    const roomCode = searchParams.get('room');

    socket.emit('JOIN_ROOM', { username: props.user.username, room: roomCode }, ({ error, code, user, room, game }) => {
      if (error) {
        switch (code) {
          case 1:
            return navigate('/lobby');

          default:
            return;
        }
      }
      setRoom(room);
      setMusics(room.musics);
      setDisplayTimer(true);
      setGame(game);
    });
  }, [props.user, navigate, searchParams]);

  useEffect(() => {
    socket.on('NEXT_ROUND', ({ step, game, isEndGame }) => {
      setDisplayResult(true);
      setDisplayGame(false);
      setTimer(TIMER_PENDING);
      setGame(game);
      setNextMusicNumber(step);
      setEndGame(isEndGame)
    });
  }, [musicNumber]);

  useEffect(() => {
    if (!inputDisabled) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  useEffect(() => {
    socket.on('UPDATE_SCORES', ({ game }) => {
      setGame(game);
    });
  }, [navigate]);

  const onTimerFinished = function (count, sending = true) {
    setTimeLeft(count);

    if (count === 0) {
      if (displayGame) {
        if (sending) {
          onSendAnswer();
        }
        setDisplayGame(false);
        setInputDisabled(true);
        updateAnswer('');
      }
      else {
        if (isEndGame) {
          return navigate(`/multi/results?room=${room.id}`);
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

  const onSendAnswer = event => {
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

    setIsCorrect(isCorrect);

    if (isCorrect) {
      score = timeLeft * 100 / room.settings.timeLimit;
    }

    socket.emit('ADD_SCORE', ({ score: Math.round(score), step: musicNumber }), ({ game }) => {
      setGame(game);
    });

    setDisplayResult(true);
    setDisplayGame(false);
    setInputDisabled(true);
    updateAnswer('');
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
        {renderGame()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={4}
      >
        {renderScore()}
      </Grid>
    </Grid>

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

        {renderPlayer()}
      </div>
    );
  }

  function renderPlayer() {
    if (!displayGame) {
      if (musicNumber >= 0 && displayResult) {
        return (
          <Result movie={musics[musicNumber].movie} music={musics[musicNumber]} />
        )
      }
      return;
    }

    return (
      <Player url={musics[musicNumber].video} />
    );
  }

  function renderScore() {
    if (!game || !game.id) {
      return;
    }

    return (
      <Paper elevation={2} className="Scores">
        <Box sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h5">Score</Typography>
            </Grid>
            {/* <Grid item>
              <Typography variant="h4">My points: 20</Typography>
            </Grid> */}
          </Grid>
          <List dense>
            {game.users.map(user => {
              let userScore = 0;

              game.rounds.map(round => {
                const newScore = round.scores.find(s => s.username === user.username);
                if (newScore) {
                  userScore = userScore + newScore.score;
                }

                return null;
              })


              return (
                <div key={`${user.id}`}>
                  <ListItem
                    secondaryAction={
                      <Typography variant="body">{userScore}</Typography>
                    }
                  >
                    <ListItemText
                      primaryTypographyProps={{ noWrap: true }}
                      primary={user.username}
                    />

                  </ListItem>
                  <Divider variant="middle" />
                </div>
              )
            })}
          </List>
        </Box>
      </Paper>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.users.me,
  }
}

export default connect(mapStateToProps, null)(Play);

