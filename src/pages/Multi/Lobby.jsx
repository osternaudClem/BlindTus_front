import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useCopyToClipboard } from 'usehooks-ts';

import {
  Button,
  Box,
  Typography,
  TextField,
  Divider,
  Stack,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useTextfield } from '../../hooks/formHooks';
import { GameSettings, GameSettingsResume } from '../../components/Forms';

const URL = 'https://blindtus.cl3tus.com';

function Lobby({ socket, onCreate, onJoin, onUpdateSettings, players, isCreator, code, settings, ...props }) {
  const [, copyToClipBoard] = useCopyToClipboard();
  const [customRoom, updateCustomRoom] = useTextfield();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  }

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

  const handleClickCopyUrl = async function (event) {
    const isCopied = await copyToClipBoard(`${URL}/lobby?code=${code}`);

    if (isCopied) {
      setAlertTitle('Lien copié dans le presse-papier.')
    }
    else {
      setAlertTitle('Votre navigateur n\'est pas compatible.');
    }

    setIsAlertOpen(true);
  }

  return (
    <div>
      <Typography component="h1" variant="h3" marginBottom={6}>
        Multijoueur {code && `Room #${code}`}
      </Typography>
      {renderAlert()}
      {code && (
        <Box marginBottom={4}>
          <TextField
            defaultValue={`${URL}/lobby?code=${code}`}
            disabled
            fullWidth
            InputProps={{
              endAdornment:
                <InputAdornment position="end" >
                  <Button
                    color="inherit"
                    onClick={handleClickCopyUrl}
                    startIcon={<ContentCopyIcon />}
                  >
                    Copy
                  </Button>
                </InputAdornment>
            }}
          />
        </Box>
      )}
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

  function renderAlert() {
    return (
      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isAlertOpen}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {alertTitle}
        </Alert>
      </Snackbar>
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