import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Button,
  Box,
  Typography,
  TextField,
  Divider,
  Stack,
} from '@mui/material';

import { socket } from '../../contexts/socket';
import { useTextfield } from '../../hooks/formHooks';
import { GameSettings, GameSettingsResume } from '../../components/Forms';

const TIMER_GAME = 30;

function Lobby({ onCreate, onJoin, onUpdateSettings, players, isCreator, code, settings, ...props }) {
  const [customRoom, updateCustomRoom] = useTextfield();

  const handleClickCreate = function () {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    onCreate(code);
  }

  const handleSubmitRoom = function (event) {
    event.preventDefault();
    if (!customRoom) {
      return;
    }

    onJoin(customRoom);
  }

  const handleChangeSettings = function (settings) {
    onUpdateSettings(settings)
  }

  const handleStartGame = function () {
    socket.emit('INIT_GAME');
  }

  return (
    <div>
      <Typography component="h1" variant="h3" marginBottom={10}>
        Multijoueur {code && `Room #${code}`}
      </Typography>
      {renderCreateGame()}
      {renderGameSettings()}
    </div>
  )

  function renderCreateGame() {
    if (code) {
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
              <Button variant="contained" onClick={handleSubmitRoom}>Rejoindre</Button>
            </Stack>
          </Box>
        </div>
      </div>
    )
  }

  function renderGameSettings() {
    if (!code) {
      return;
    }

    return (
      <div>
        {
          isCreator
            ? <GameSettings onSettingsChange={handleChangeSettings} onSettingsSaved={handleStartGame} noGameCode />
            : <GameSettingsResume
              game={{
                round_time: settings.timeLimit,
                difficulty: settings.difficulty,
                totalMusics: settings.totalMusics,
              }}
              code={code}
            />
        }
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

Lobby.propTypes = {
  onCreate: PropTypes.func,
  onJoin: PropTypes.func,
  players: PropTypes.array,
};

Lobby.defaultProps = {
  onCreate: () => { },
  onJoin: () => { },
  players: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);