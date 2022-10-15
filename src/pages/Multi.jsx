import { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  CssBaseline,
  Grid,
  Alert,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { callApi } from '../lib/axios';
import { SocketContext } from '../contexts/sockets';
import Lobby from './Multi/Lobby';
import Play from './Multi/Play';
import Results from './Multi/Results';
import { UserAvatar } from '../components/Avatar';

const TIMER_GAME = 30;
const NOVIE_NUMBER = 10;

function Multi(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);
  const [room, setRoom] = useState(null);
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [timeLimit, setTimeLimit] = useState(TIMER_GAME);
  const [difficulty, setDifficulty] = useState('easy');
  const [totalMusics, setTotalMusics] = useState(NOVIE_NUMBER);
  const [musics, setMusics] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomCode = urlParams.get('code');

  const onJoinGame = useCallback((customRoom) => {
    socket.emit('JOIN_ROOM', { username: props.user.username, room: customRoom }, ({ error, user, room }) => {
      if (error) {
        console.log('>>> error', error);
        setOpen(true);
        return setError(error);
      }

      setIsCreator(user.isCreator);
      setCode(customRoom);
      setTimeLimit(room.settings.timeLimit);
      setDifficulty(room.settings.difficulty);
      setTotalMusics(room.settings.totalMusics);
    });
  }, [props.user, socket]);

  useEffect(() => {
    // window.addEventListener('beforeunload', handleTabClose);

    socket.on('ERROR', error => {
      setOpen(true);
      setError(error);
    });

    socket.on('PLAYER_DISCONNECTED', (player, game) => {
      setGame(game);
    })

    socket.on('SETTINGS_UPDATED', settings => {
      setTimeLimit(settings.timeLimit);
      setDifficulty(settings.difficulty);
      setTotalMusics(settings.totalMusics);
    });

    socket.on('NEW_CREATOR', () => {
      setIsCreator(true);
    });

    socket.on('START_GAME', ({ room, game, musics }) => {
      setGame(game);
      setMusics(musics);
      setRoom(room);
      setIsStarted(true);
    });

    socket.on('UPDATE_SCORES', ({ game }) => {
      setGame(game);
    });

    socket.on('NEW_GAME', () => {
      setIsStarted(false);
      setIsEndGame(false);
    });

    socket.on('disconnect', reason => {
      console.log('>>> reason', reason);
    });


    if (roomCode) {
      onJoinGame(roomCode);
    }

    return () => {
      // window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [navigate, socket, roomCode, onJoinGame]);

  useEffect(() => {
    socket.on('ROOM_USERS', async users => {
      const response = await callApi.get(`/users?usernames=${users.map(user => user.username)}`);
      users.map((user, index) => user.info = response.data[index]);
      setPlayers(users);
    });
  }, [socket])

  const handleTabClose = function (event) {
    event.preventDefault();

    const message = 'Etes-vous sur de vouloir quitter la page ?';
    event.returnValue = message;
    return message;
  };

  const handleClickError = function () {
    setError(null);
    setOpen(false);
  }

  const onCreateGame = function (code) {
    socket.emit('CREATE_ROOM', {
      username: props.user.username,
      room: code,
      settings: {
        timeLimit,
        difficulty,
        totalMusics,
      },
    }, ({ error, user }) => {
      if (error) {
        return setError(error);
      }
      setCode(code);
      setIsCreator(true);
    });
  }

  const onUpdateSettings = function (settings) {
    socket.emit('UPDATE_SETTINGS', settings);
  }

  const onAnswer = function (score, step) {
    socket.emit('ADD_SCORE', ({ score: Math.round(score), step }), ({ game }) => {
      setGame(game);
    });
  }

  const onEndGame = function() {
    setIsEndGame(true);
  }

  const onNewGame = function () {
    socket.emit('ASK_NEW_GAME', () => {
      setIsStarted(false);
      setIsEndGame(false);
    });
  }

  return (
    <Grid container spacing={12} component="main" className="LoginPage">
      <CssBaseline />
      {open &&
        <Alert
          variant="outlined"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClickError}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      }
      <Grid
        item
        xs={12}
        sm={9}
        md={8}
      >
        {render()}
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        md={4}
      >
        {renderSide()}
      </Grid>
    </Grid>
  );

  function render() {
    if (!isStarted) {
      return (
        <Lobby
          socket={socket}
          onCreate={onCreateGame}
          onJoin={onJoinGame}
          onUpdateSettings={onUpdateSettings}
          players={players}
          isCreator={isCreator}
          code={code}
          settings={{
            timeLimit,
            difficulty,
            totalMusics,
          }}
        />
      )
    }

    if (!isEndGame) {
      return (
        <Play
          socket={socket}
          musics={musics}
          room={room}
          isCreator={isCreator}
          onAnswer={onAnswer}
          onEndGame={onEndGame}
        />
      )
    }

    return (
      <Results game={game} players={players} onNewGame={onNewGame} />
    )
  }

  function renderSide() {
    if (!isStarted) {
      return (
        <div>
          <Typography variant="h4" gutterBottom>Joueurs</Typography>
          <Stack spacing={1}>
            {players.map((player, index) => {
              return <UserAvatar key={index} username={player.username} avatar={player.info ? player.info.avatar : null} displayUsername="right" />
            })}
          </Stack>
        </div>
      )
    }

    if (!isEndGame) {
      return renderScore();
    }

    let usersScore = [];

    game.users.map(user => {
      let userScore = 0;

      game.rounds.map(round => {
        const newScore = round.scores.find(s => s.username === user.username);
        if (newScore) {
          userScore = userScore + newScore.score;
        }

        return null;
      });
      usersScore.push({ username: user.username, score: userScore });

      return null;
    });
    usersScore = usersScore.sort((a, b) => b.score - a.score);

    return (
      <div>
        <Typography variant="h4" gutterBottom>Joueurs</Typography>
        <Stack spacing={1}>
          {usersScore.map((score, index) => {
            const player = players.find(p => p.username === score.username);
            return (
              <Stack direction="row" spacing={2} alignItems="center" key={index}>
                <UserAvatar username={player.username} avatar={player.info.avatar} displayUsername="right" />
                <Typography variant="h6">{score.score}</Typography>
              </Stack>
            )
          })}
        </Stack>
      </div>
    )
  }

  function renderScore() {
    if (!game || !game.id) {
      return;
    }

    return (
      <Box sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Scores</Typography>
          </Grid>
        </Grid>
        <List dense>
          {game.users.map((user, index) => {
            let userScore = 0;

            game.rounds.map(round => {
              const newScore = round.scores.find(s => s.username === user.username);
              if (newScore) {
                userScore = userScore + newScore.score;
              }

              return null;
            });

            return (
              <div key={`${user.id}`}>
                <ListItem
                  secondaryAction={
                    <Typography variant="body">{userScore}</Typography>
                  }
                >
                  <UserAvatar avatar={players[index].info.avatar} username={user.username} displayUsername="right" />
                </ListItem>
                <Divider variant="middle" />
              </div>
            )
          })}
        </List>
      </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.users.me,
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Multi);