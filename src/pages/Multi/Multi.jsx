import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CssBaseline,
  Grid,
  Box,
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
import { categoriesActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { getLevel } from '../../lib/levels';

const STEPS = {
  ROUND_RESULT: 'round_result',
};

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const AvatarLevel = styled('div')`
  background: ${({ theme }) => theme.palette.primary.main};
  color: #fff;
  border: solid 2px #000;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  font-size: 11px;
  display: flex;
  font-weight: bold;
  align-items: center;
  justify-content: center;
`;

function Multi(props) {
  const [isCreator, setIsCreator] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [step, setStep] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [players, updatePlayers] = useState([]);
  const [loadings, updateLoadings] = useState([]);
  const [error, setError] = useState(null);
  const [room, updateRoom] = useState({});
  const { user } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    updateTitle('Multijoueur');
  }, []);

  useEffect(() => {
    if (!props.categories.length) {
      props.categoriesActions.getCategories();
    }
  }, [props.categories, props.categoriesActions]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.emit('FORCE_DISCONNECT');
    };
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

    socket.on('KICK', () => {
      navigate('/lobby');
    });

    socket.on('NEW_CREATOR', () => {
      setIsCreator(true);
    });

    socket.on('SETTINGS_UPDATED', (room) => {
      updateRoom(room);
    });

    socket.on('START_GAME', (room) => {
      updateRoom(room);
      setIsStarted(true);
    });

    socket.on('START_MUSIC', (room) => {
      updateRoom(room);
    });

    socket.on('IS_EVERYBODY_READY', ({ allReady, loadings = [] }) => {
      updateLoadings(loadings);
      setIsReady(allReady);
    });

    socket.on('NEXT_ROUND', ({ room }) => {
      updateLoadings([]);
      updateRoom(room);
    });

    socket.on('NEW_GAME', (room) => {
      updateRoom(room);
      setIsStarted(false);
      setIsEndGame(false);
    });

    socket.on('UPDATE_SCORES', (room) => {
      updateRoom(room);
    });
  }, [socket, navigate]);

  const onCreateGame = function (code) {
    socket.emit(
      'CREATE_ROOM',
      {
        username: user.username,
        _id: user._id,
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

  const onJoinGame = useCallback(
    (code) => {
      socket.emit(
        'JOIN_ROOM',
        { _id: user._id, username: user.username, room: code },
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
    },
    [socket, user._id, user.username]
  );

  const handleClickDisconnect = function (user) {
    socket.emit('KICK_USER', { user });
  };

  const onUpdateSettings = useCallback(
    (settings) => {
      socket.emit('UPDATE_SETTINGS', room.id, settings);
    },
    [socket, room]
  );

  const onDisconnect = function (user) {
    socket.emit('KICK_USER', { user });
  };

  const onAnswer = function (score, step, answer) {
    socket.emit('ADD_SCORE', { score, step, answer }, (room) => {
      updateRoom(room);
    });
  };

  const onEndGame = function () {
    setIsEndGame(true);
  };

  const onNewGame = function () {
    socket.emit('ASK_NEW_GAME');
  };

  const onStep = function (step) {
    setStep(step);
  };

  return (
    <Grid
      container
      spacing={12}
      component="main"
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
          error={error}
          onClearError={() => setError(null)}
        />
      );
    }

    if (!isEndGame) {
      return (
        <Play
          socket={socket}
          room={room}
          players={players}
          isCreator={isCreator}
          isReady={isReady}
          onAnswer={onAnswer}
          isEndGame={isEndGame}
          onEndGame={onEndGame}
          onStep={onStep}
        />
      );
    }

    return (
      <Results
        room={room}
        players={players}
        isCreator={isCreator}
        onNewGame={onNewGame}
      />
    );
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
              const playerLevel = getLevel(player.info.exp);
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
                    badge={
                      <AvatarLevel>{playerLevel.currentLevel}</AvatarLevel>
                    }
                  />
                </Stack>
              );
            })}
          </Stack>
        </PaperBox>
      );
    }

    if (!isEndGame) {
      return renderScore();
    }

    let usersScore = [];

    room.players.map((user) => {
      let userScore = 0;

      room.rounds.map((round) => {
        const newScore = round.scores.find((s) => s.username === user.username);
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
      <PaperBox>
        <Typography
          variant="h4"
          gutterBottom
        >
          Joueurs
        </Typography>
        <Stack spacing={1}>
          {usersScore.map((score, index) => {
            const player = players.find((p) => p.username === score.username);
            const playerLevel = getLevel(player.info.exp);

            return (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                key={index}
              >
                <UserAvatar
                  username={player.username}
                  avatar={player.info.avatar}
                  displayUsername="right"
                  badge={<AvatarLevel>{playerLevel.currentLevel}</AvatarLevel>}
                  style={{ flexGrow: 1 }}
                />
                <Typography variant="h6">{score.score}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </PaperBox>
    );
  }

  function renderScore() {
    if (!room || !room.id) {
      return;
    }

    let usersScore = [];

    room.players.map((user) => {
      let userScore = 0;

      room.rounds.map((round) => {
        const newScore = round.scores.find((s) => s.username === user.username);
        if (newScore) {
          userScore = userScore + newScore.score;
        }

        return null;
      });

      return usersScore.push({
        username: user.username,
        score: userScore,
        id: user.id,
      });
    });

    usersScore = usersScore.sort((a, b) => b.score - a.score);
    return (
      <PaperBox>
        <Grid
          container
          alignItems="center"
        >
          <Grid
            item
            xs
          >
            <Typography variant="h5">Scores</Typography>
          </Grid>
        </Grid>
        <List dense>
          {usersScore.map((user, index) => {
            if (!players.length || !players[index]) {
              return null;
            }

            const player = players.find((p) => p.username === user.username);
            const playerLevel = getLevel(player.info.exp);

            return (
              <div key={index}>
                <ListItem
                  sx={{ paddingLeft: 0, paddingRight: 0 }}
                  secondaryAction={
                    <Typography variant="body">{user.score}</Typography>
                  }
                >
                  {isCreator && (
                    <IconButton onClick={() => handleClickDisconnect(user)}>
                      <CloseIcon />
                    </IconButton>
                  )}
                  {loadings.find((l) => l.id === user.id && l.loading < 100) &&
                  !isReady &&
                  step !== STEPS.ROUND_RESULT ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <CircularProgressWithLabel
                        color="primary"
                        value={loadings.find((l) => l.id === user.id).loading}
                      />
                      <Typography>{user.username}</Typography>
                    </Stack>
                  ) : (
                    <UserAvatar
                      avatar={players[index].info.avatar}
                      username={user.username}
                      displayUsername="right"
                      badge={
                        <AvatarLevel>{playerLevel.currentLevel}</AvatarLevel>
                      }
                    />
                  )}
                </ListItem>
                <Divider sx={{ marginTop: '8px' }} />
              </div>
            );
          })}
        </List>
      </PaperBox>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categories.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    categoriesActions: bindActionCreators(categoriesActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Multi);
