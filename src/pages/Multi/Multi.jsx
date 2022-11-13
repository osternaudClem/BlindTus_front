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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { callApi } from '../../lib/axios';
import { updateTitle } from '../../lib/document';
import { SocketContext } from '../../contexts/sockets';
import Lobby from './Lobby';
import Play from './Play';
import Results from './Results';
import { UserAvatar } from '../../components/Avatar';
import { PaperBox } from '../../components/UI';
import { UserContext } from '../../contexts/userContext';

const TIMER_GAME = 30;
const NOVIE_NUMBER = 10;

function Multi(props) {
  const [error, setError] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [players, updatePlayers] = useState([]);
  const [room, updateRoom] = useState({});
  const { user } = useContext(UserContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    updateTitle('Multijoueur');
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, [socket]);

  useEffect(() => {
    socket.on('SETTINGS_UPDATED', (room) => {
      updateRoom(room);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('ROOM_USERS', async (players) => {
      const response = await callApi.get(
        `/users?usernames=${players.map((player) => player.username)}`
      );

      players.map(
        (player, index) =>
          (player.info = response.data.find(
            (d) => d.username === player.username
          ))
      );
      updatePlayers(players);
    });

    return function () {
      socket.off('ROOM_USERS');
      socket.emit('LEAVE_ROOM');
    };
  }, [socket]);

  const onCreateGame = function (code) {
    socket.emit(
      'CREATE_ROOM',
      {
        username: user.username,
        room: code,
        settings: {
          time_limit: 30,
          difficulty: 'easy',
          total_musics: 10,
        },
      },
      (newRoom) => {
        setIsCreator(true);
        updateRoom(newRoom);
      }
    );
  };

  const onJoinGame = function (code) {
    socket.emit(
      'JOIN_ROOM',
      { username: user.username, room: code },
      ({ error, user, room }) => {
        if (error) {
          console.log('>>> error', error);
        }

        setIsCreator(user.isCreator);
        updateRoom(room);

        return () => {
          socket.off('JOIN_ROOM');
        };
      }
    );
  };

  const onUpdateSettings = function (settings) {
    socket.emit('UPDATE_SETTINGS', room.id, settings);
  };

  const onDisconnect = function (user) {
    socket.emit('KICK_USER', { user });
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
          room={room}
          isCreator={isCreator}
        />
      );
    }

    return null;
  }

  function renderSide() {
    if (!isStarted && room.id) {
      return (
        <PaperBox>
          <Typography
            variant="h4"
            gutterBottom
          >
            Joueurs
          </Typography>
          <Stack spacing={1}>
            {players.map((player, index) => {
              return (
                <Stack
                  direction="row"
                  alignItems="center"
                  key={index}
                >
                  {isCreator && (
                    <IconButton onClick={() => onDisconnect(player)}>
                      <CloseIcon />
                    </IconButton>
                  )}
                  <UserAvatar
                    username={player.username}
                    avatar={player.info ? player.info.avatar : null}
                    displayUsername="right"
                  />
                </Stack>
              );
            })}
          </Stack>
        </PaperBox>
      );
    }

    return null;
  }
}

export default Multi;
