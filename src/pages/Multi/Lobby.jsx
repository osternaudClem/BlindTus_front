import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useCopyToClipboard } from 'usehooks-ts';

import {
  Button,
  Box,
  TextField,
  Divider,
  Stack,
  InputAdornment,
  Snackbar,
  Alert,
  AlertTitle,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useTextfield } from '../../hooks/formHooks';
import { GameSettings, GameSettingsResume } from '../../components/Forms';
import { Heading, PaperBox } from '../../components/UI';
import { useLocation } from 'react-router-dom';

const URL = 'https://blindtus.com';

function Lobby({
  socket,
  onCreate,
  onJoin,
  onUpdateSettings,
  isCreator,
  room,
  error,
  onClearError,
  ...props
}) {
  const [, copyToClipBoard] = useCopyToClipboard();
  const [customRoom, updateCustomRoom] = useTextfield();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const { search } = useLocation();

  const urlCode = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('code');
  }, [search]);

  useEffect(() => {
    if (urlCode) {
      onJoin(urlCode);
    }
  }, [onJoin, urlCode]);

  const handleCloseAlert = useCallback(() => {
    setIsAlertOpen(false);
  }, []);

  const handleClickCreate = useCallback(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    onCreate(code);
  }, [onCreate]);

  const handleSubmitRoom = function (event) {
    event.preventDefault();
    if (!customRoom) {
      return;
    }

    onJoin(customRoom);
  };

  const handleChangeSettings = function (settings) {
    onUpdateSettings(settings);
  };

  const handleStartGame = function () {
    socket.emit('INIT_GAME');
  };

  const handleClickCopyUrl = async function () {
    const isCopied = await copyToClipBoard(`${URL}/lobby?code=${room.id}`);

    if (isCopied) {
      setAlertTitle('Lien copié dans le presse-papier.');
    } else {
      setAlertTitle("Votre navigateur n'est pas compatible.");
    }

    setIsAlertOpen(true);
  };

  return (
    <div>
      <Heading>Multijoueur {room.id && `Room #${room.id}`}</Heading>
      {error ? (
        <Alert
          severity="error"
          sx={{ marginBottom: '24px' }}
          onClose={onClearError}
        >
          <AlertTitle>Erreur</AlertTitle>
          {error}
        </Alert>
      ) : null}
      {renderAlert()}
      {room.id && (
        <Box marginBottom={4}>
          <TextField
            defaultValue={`${URL}/lobby?code=${room.id}`}
            disabled
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="inherit"
                    onClick={handleClickCopyUrl}
                    startIcon={<ContentCopyIcon />}
                  >
                    Copy
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      {renderCreateGame()}
      {renderGameSettings()}
    </div>
  );

  function renderCreateGame() {
    if (room.id) {
      return;
    }

    return (
      <PaperBox>
        <Button
          variant="contained"
          onClick={handleClickCreate}
        >
          Créer une partie
        </Button>
        <Divider
          textAlign="left"
          sx={{ margin: '12px 0' }}
        >
          Ou
        </Divider>
        <Box
          component="form"
          onSubmit={handleSubmitRoom}
        >
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="Rejoindre une room"
              onChange={updateCustomRoom}
            />
            <Button
              variant="contained"
              onClick={handleSubmitRoom}
            >
              Rejoindre
            </Button>
          </Stack>
        </Box>
      </PaperBox>
    );
  }

  function renderGameSettings() {
    if (!room.id) {
      return;
    }

    return (
      <div>
        {isCreator ? (
          <GameSettings
            onSettingsChange={handleChangeSettings}
            onSettingsSaved={handleStartGame}
            room={room}
            noGameCode
          />
        ) : (
          <GameSettingsResume
            game={{
              round_time: room.settings.time_limit,
              difficulty: room.settings.difficulty,
              total_musics: room.settings.total_musics,
              categories: room.settings.categories,
            }}
            code={room.id}
          />
        )}
      </div>
    );
  }

  function renderAlert() {
    return (
      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isAlertOpen}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: '100%' }}
        >
          {alertTitle}
        </Alert>
      </Snackbar>
    );
  }
}

Lobby.propTypes = {
  onCreate: PropTypes.func,
  onJoin: PropTypes.func,
  players: PropTypes.array,
  error: PropTypes.string,
  onClearError: PropTypes.func,
};

Lobby.defaultProps = {
  onCreate: () => {},
  onJoin: () => {},
  players: [],
  error: null,
  onClearError: () => {},
};

export default Lobby;
