import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Button,
  Box,
  CssBaseline,
  Typography,
  Grid,
  TextField,
  Alert,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { socket } from '../../contexts/socket';
import { useTextfield } from '../../hooks/formHooks';
import { Chat } from '../../components/Chat';
import { GameSettings, GameSettingsResume } from '../../components/Forms';

const TIMER_GAME = 30;

function Lobby(props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inGame,] = useState(false);
  const [room, setRoom] = useState(null);
  const [customRoom, updateCustomRoom] = useTextfield();
  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [timeLimit, setTimeLimit] = useState(TIMER_GAME);
  const [difficulty, setDifficulty] = useState('easy');
  const [totalMusics, setTotalMusics] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // window.addEventListener('beforeunload', handleTabClose);

    socket.on('MESSAGE', message => {
      setMessages(m => [...m, message]);
    });

    socket.on('ERROR', error => {
      setOpen(true);
      setError(error);
    });

    socket.on('ROOM_USERS', users => {
      setPlayers(users);
    });

    socket.on('PLAYER_DISCONNECTED', player => {
      console.log('>>> player disconnected', player);
    })

    socket.on('SETTINGS_UPDATED', settings => {
      setTimeLimit(settings.timeLimit);
      setDifficulty(settings.difficulty);
      setTotalMusics(settings.totalMusics);
    });

    socket.on('NEW_CREATOR', () => {
      setIsCreator(true);
    });

    socket.on('START_GAME', ({ room, game }) => {
      navigate(`/play?room=${room}`);
    });

    socket.on('disconnect', reason => {
      console.log('>>> reason', reason);
    });

    return () => {
      // window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [navigate]);

  const handleTabClose = function (event) {
    event.preventDefault();

    console.log('beforeunload event triggered');

    return (event.returnValue = 'Etes-vous sur de vouloir quitter la page ?');
  };

  const handleClickCreate = function () {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    socket.emit('CREATE_ROOM', {
      username: props.user.username,
      room: code,
      settings: {
        timeLimit,
        difficulty,
        totalMusics,
      },
    }, ({error}) => {
      if (error) {
        return setError(error);
      }
      setRoom(code);
      setIsCreator(true);
    });
  }

  const handleSubmitRoom = function (event) {
    event.preventDefault();
    if (!customRoom) {
      return;
    }

    socket.emit('JOIN_ROOM', { username: props.user.username, room: customRoom }, ({ error, user, room }) => {
      if (error) {
        setOpen(true);
        return setError(error);
      }

      setIsCreator(user.isCreator);
      setRoom(customRoom);
      setTimeLimit(room.settings.timeLimit);
      setDifficulty(room.settings.difficulty);
      setTotalMusics(room.settings.totalMusics);
    });
  }

  const handleSendChat = function (chat) {
    socket.emit('SEND_CHAT', { username: props.user.username, room, message: chat });
  }

  const handleClickError = function () {
    setError(null);
    setOpen(false);
  }

  const handleClickLeave = function () {
    socket.emit('FORCE_DISCONNECT');
    navigate(0);
  }

  const handleChangeSettings = function (settings) {
    socket.emit('UPDATE_SETTINGS', settings);
  }

  const handleStartGame = function () {
    socket.emit('INIT_GAME');
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
        <Typography component="h1" variant="h3" marginBottom={10}>
          Multijoueur {room && `Room #${room}`}
        </Typography>
        {/* <Button onClick={handleClickLeave}>Quitter le groupe</Button> */}
        {renderCreateGame()}
        {renderGameSettings()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={4}
      >
        {room &&
          <Chat messages={messages} onSendChat={handleSendChat} />
        }
      </Grid>
    </Grid>
  )

  function renderCreateGame() {
    if (inGame || room) {
      return;
    }

    return (
      <div>
        <div>
          <Button variant="contained" onClick={handleClickCreate}>Créer une partie</Button>
          <Divider textAlign="left" sx={{ margin: '12px 0' }}>Ou</Divider>
          <Box component="form" onSubmit={handleSubmitRoom}>
            <Stack
              direction="row"
              spacing={2}
              >
              <TextField
                label="Rejoindre une room"
                onChange={updateCustomRoom}
              />
              <Button variant="contained" onClick={handleClickCreate}>Rejoindre</Button>
            </Stack>
          </Box>

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
        </div>
      </div >
    )
  }

  function renderGameSettings() {
    if (!inGame && !room) {
      return;
    }
    return (
      <Grid container spacing={12} component="main">
        <Grid
          item
          xs={12}
          sm={9}
          md={8}
        >
          {isCreator
            ? <GameSettings onSettingsChange={handleChangeSettings} onSettingsSaved={handleStartGame} noGameCode />
            : <GameSettingsResume
              game={{
                round_time: timeLimit,
                difficulty,
                totalMusics,
              }}
              code={room}
            />
          }
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          md={4}
        >
          {renderPlayers()}
        </Grid>
      </Grid>
    )
  }

  function renderPlayers() {
    return (
      <div>
        <Typography variant="h4">Joueurs</Typography>
        <ul>
          {players.map((player, index) => {
            return <li key={index}>{player.username}</li>
          })}
        </ul>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);