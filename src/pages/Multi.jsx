import { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  CssBaseline,
  Grid,
  Alert,
  IconButton,
  Typography,
  List,
  ListItem,
  Divider,
  Stack,
  CircularProgress,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { callApi } from '../lib/axios';
import { updateTitle } from '../lib/document';
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
  const [roundStarted, setRoundStarted] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [timeLimit, setTimeLimit] = useState(TIMER_GAME);
  const [difficulty, setDifficulty] = useState('easy');
  const [totalMusics, setTotalMusics] = useState(NOVIE_NUMBER);
  const [musics, setMusics] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomCode = urlParams.get('code');

  useEffect(() => {
    updateTitle('Multijoueur');
  }, []);

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

      return (() => {
        socket.off('JOIN_ROOM');
      });
    });
  }, [socket, props.user.username]);

  useEffect(() => {
    // window.addEventListener('beforeunload', handleTabClose);

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('ERROR', error => {
      setOpen(true);
      setError(error);
    });

    socket.on('KICK', () => {
      navigate(0);
    })

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

    socket.on('NEXT_ROUND', ({ game }) => {
      setRoundStarted(false);
      setScores(game.rounds);
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

    socket.on('IS_EVERYBODY_READY', ({ players }) => {
      setReadyPlayers(players);
    });

    socket.on('START_MUSIC', () => {
      setRoundStarted(true);
    });

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      socket.off('ERROR');
      socket.off('KICK');
      socket.off('PLAYER_DISCONNECTED');
      socket.off('SETTINGS_UPDATED');
      socket.off('NEW_CREATOR');
      socket.off('START_GAME');
      socket.off('UPDATE_SCORES');
      socket.off('NEW_GAME');
      socket.off('NEXT_ROUND');
      socket.off('IS_EVERYBODY_READY');
      socket.off('disconnect');
    };
  }, [socket, navigate, onJoinGame, roomCode]);

  useEffect(() => {
    socket.on('ROOM_USERS', async users => {
      const response = await callApi.get(`/users?usernames=${users.map(user => user.username)}`);
      users.map((user, index) => user.info = response.data.find(d => d.username === user.username));
      setPlayers(users);
    });

    return function () {
      socket.off('ROOM_USERS');
      socket.emit('LEAVE_ROOM');
    }
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

  const onAnswer = function (score, step, answer) {
    socket.emit('ADD_SCORE', ({ score: Math.round(score), step, answer }), ({ game }) => {
      setGame(game);
    });
  }

  const onEndGame = function () {
    setIsEndGame(true);
  }

  const onNewGame = function () {
    socket.emit('ASK_NEW_GAME', () => {
      setIsStarted(false);
      setIsEndGame(false);
    });
  }

  const handleClickDisconnect = function (user) {
    socket.emit('KICK_USER', { user });
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
        sm={6}
        md={8}
      >
        {render()}
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
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
          game={game}
          players={players}
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
    if (!isStarted && code) {
      return (
        <Paper elevation={2} style={{ padding: '8px 16px' }}>
          <Typography variant="h4" gutterBottom>Joueurs</Typography>
          <Stack spacing={1}>
            {players.map((player, index) => {
              return (
                <Stack direction="row" alignItems="center" key={index}>
                  {isCreator &&
                    <IconButton onClick={() => handleClickDisconnect(player)}>
                      <CloseIcon />
                    </IconButton>
                  }
                  <UserAvatar username={player.username} avatar={player.info ? player.info.avatar : null} displayUsername="right" />
                </Stack>
              )
            })}
          </Stack>
        </Paper>
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
      <Paper elevation={2} style={{ padding: '8px 16px' }}>
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
      </Paper>
    )
  }

  function renderScore() {
    if (!game || !game.id) {
      return;
    }

    let usersScore = [];

    game.users.map(user => {
      let userScore = 0;

      scores.map(round => {
        const newScore = round.scores.find(s => s.username === user.username);
        if (newScore) {
          userScore = userScore + newScore.score;
        }

        return null;
      });

      return usersScore.push({ username: user.username, score: userScore, id: user.id });
    });

    usersScore = usersScore.sort((a, b) => b.score - a.score);

    return (
      <Paper sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Scores</Typography>
          </Grid>
        </Grid>
        <List dense>
          {usersScore.map((user, index) => {
            return (
              <div key={index}>
                <ListItem
                  sx={{ paddingLeft: 0, paddingRight: 0 }}
                  secondaryAction={
                    (!readyPlayers.includes(user.id) && roundStarted)
                      ? <CircularProgress color="primary" />
                      : <Typography variant="body">{user.score}</Typography>
                  }
                >
                  {isCreator &&
                    <IconButton onClick={() => handleClickDisconnect(user)}>
                      <CloseIcon />
                    </IconButton>
                  }
                  <UserAvatar
                    avatar={players[index].info.avatar}
                    username={user.username}
                    displayUsername="right"
                  />
                </ListItem>
                <Divider sx={{ marginTop: '8px' }} />
              </div>
            )
          })}
        </List>
      </Paper>
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