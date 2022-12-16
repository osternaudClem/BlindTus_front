import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useCopyToClipboard } from 'usehooks-ts';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  CssBaseline,
  Typography,
  Box,
  IconButton,
  Grid,
  Alert,
  Snackbar,
  Stack,
  Tooltip,
  useMediaQuery,
  Chip,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import TvIcon from '@mui/icons-material/Tv';

import { addLeadingZeros } from '../../lib/number';
import { checkSimilarity } from '../../lib/check';
import { addSpaces } from '../../lib/array';
import { callApi } from '../../lib/axios';
import { GamePlayer } from '../Game';
import { Timer } from '../Timer';
import { Steps } from '../Steps';
import { HistoryDay } from '../History';
import { Result } from '../Results';
import { useTextfield } from '../../hooks/formHooks';
import { MovieTextField } from '../Forms';
import { Heading, PaperBox } from '../UI';
import { Rules, Stats } from './';
import { MovieCard } from '../Cards';

const TIMERS = [10, 25, 40, 70, 120];
// const TIMERS = [3, 3, 3, 3, 3];

const STEPS = {
  BEGINING: 'begining',
  PLAYING: 'playing',
  ENDED: 'ended',
};

function Today({ onSaveHistory, game, history }) {
  const [step, setStep] = useState(STEPS['BEGINING']);
  const [isRulesOpen, setRulesOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [tries, setTries] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [answerSent, setAnswerSent] = useState(true);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [, copyToClipBoard] = useCopyToClipboard();
  const answerField = useRef(null);
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const queryKey = ['yesteray'];
  const { isLoading, data } = useQuery(queryKey, () =>
    callApi.get(`/musicsday/yesterday`)
  );

  useEffect(() => {
    setIsCorrect(history.isWin);
    setTries(history.attempts && history.attempts.length);
  }, [history]);

  useEffect(() => {
    if (!displayTimer && answerField.current) {
      answerField.current.focus();
    }
  }, [displayTimer]);

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  };

  const handleClickNext = function () {
    setStep(STEPS['PLAYING']);
    if (!answerSent) {
      onSaveHistory('', false);
      setTries((s) => s + 1);
    }

    setAnswerSent(false);
    setDisplayGame(true);
    setDisplayTimer(true);
    setIsCorrect(null);
    answerField.current.focus();
  };

  const onTimerTick = function (tick) {
    if (tick === 0) {
      setDisplayTimer(false);
      setDisplayGame(false);
    }
  };

  const onSendAnswer = (event) => {
    if (event) {
      event.preventDefault();
    }

    const media = game.music.movie || game.music.tvShow;
    if (answer.trim().length === 0) {
      return;
    }

    const titles = [media.title, media.title_fr, ...media.simple_title];

    let isCorrect = checkSimilarity(answer, titles);

    setIsCorrect(isCorrect);

    onSaveHistory(answer, isCorrect);

    updateAnswer('');
    setAnswerSent(true);
    setDisplayTimer(false);
    setDisplayGame(false);
    setTries((s) => s + 1);

    if (tries === 4) {
      setStep(STEPS['ENDED']);
    }
  };

  const handleCliclSkipRound = function () {
    onSaveHistory('', false);
    setDisplayTimer(false);
    setDisplayGame(false);
    setTries((s) => s + 1);
    setAnswerSent(true);

    if (tries === 4) {
      setStep(STEPS['ENDED']);
    }
  };

  const handleClickShareResult = async function () {
    let header = `🎬 BlindTus 🍿 #${addLeadingZeros(game.totalTodays, 3)}\n\n`;

    for (let i = 0; i < 5; i++) {
      // Wrong ❌
      // Correct ✅
      // Other tries ⬛
      let emote = '⬛';

      if (history.attempts.length === i + 1 && history.isWin) {
        emote = '✅';
      } else if (history.attempts.length > i + 1 || !history.isWin) {
        emote = '❌';
      }

      header = header + `${emote}`;
    }

    header = header + `\n\nhttps://blindtus.com/today`;

    const isCopied = await copyToClipBoard(header);

    if (isCopied) {
      setAlertTitle('Résumé copié dans le presse-papier.');
    } else {
      setAlertTitle("Votre navigateur n'est pas compatible.");
    }

    setIsAlertOpen(true);
  };

  if (!game) {
    return;
  }

  return (
    <Grid
      container
      spacing={12}
      component="main"
      className="LoginPage"
    >
      <CssBaseline />
      {renderAlert()}
      <Grid
        item
        xs={12}
        sm={6}
        md={8}
      >
        <Stack
          direction="row"
          alignItems={largeScreen ? 'center' : 'flex-end'}
        >
          <Heading style={{ flexGrow: 1 }}>
            Musique du jour
            <Tooltip
              title="Règles"
              placement="top"
            >
              <IconButton onClick={() => setRulesOpen(true)}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Heading>
          <Tooltip
            title="Statistiques"
            placement="top"
          >
            <IconButton
              onClick={() => setStatsOpen(true)}
              style={{ marginBottom: '34px' }}
            >
              <BarChartIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Typography marginBottom={2}>
          Aujourd'hui, nous recherchons
          {game.music.movie ? (
            <Chip
              icon={<LocalMoviesIcon />}
              label="Un film"
              variant="outlined"
              color="success"
              sx={{ paddingLeft: 1, marginLeft: 1 }}
            />
          ) : (
            <Chip
              icon={<TvIcon />}
              label="Une série"
              variant="outlined"
              color="info"
              sx={{ paddingLeft: 1, marginLeft: 1 }}
            />
          )}
        </Typography>

        {endedGame()}
        {renderGame()}

        {renderPlayer()}
        {renderDialogExplication()}
        {renderDialogStats()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
      >
        <HistoryDay history={history} />
        {renderYesterday()}
      </Grid>
    </Grid>
  );

  function renderGame() {
    if (history.isCompleted) {
      return;
    }

    return (
      <div>
        <Steps
          steps={[1, 2, 3, 4, 5]}
          active={tries}
          correct={
            history.today &&
            history.today.isWin &&
            history.today.attempts.length
          }
        />
        {displayTimer && step !== 'ENDED' && (
          <Timer
            limit={TIMERS[tries]}
            key={`timer-${tries}`}
            onFinished={onTimerTick}
          />
        )}
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
          mb={4}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(event) => onSendAnswer(event)}
        >
          <MovieTextField
            inputRef={answerField}
            onChange={updateAnswer}
            value={answer}
            isCorrect={isCorrect}
            addSkipButton
            onSkipRound={handleCliclSkipRound}
            placeholder={
              game.music.movie === 'movie'
                ? 'Tapez le nom du film'
                : 'Tapez le nom de la série'
            }
          />
        </Box>
        {!displayGame && (
          <Box align="center">
            <Button
              onClick={handleClickNext}
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              sx={{ marginBottom: '16px' }}
            >
              Lancer la musique
            </Button>
          </Box>
        )}
        {renderClues()}
      </div>
    );
  }

  function endedGame() {
    if (!history.isCompleted) {
      return;
    }

    return (
      <div>
        <Alert variant="outlined">
          La partie est finie pour aujourd'hui. Revenez demain !
        </Alert>
        <Box sx={{ margin: '24px 0' }}>
          <Button
            variant="contained"
            onClick={handleClickShareResult}
          >
            Partager le résultat
          </Button>
        </Box>
        <Result
          movie={game.music.movie || game.music.tvShow}
          music={game.music}
        />
      </div>
    );
  }

  function renderPlayer() {
    if (!displayGame) {
      return;
    }

    return (
      <GamePlayer
        audioName={game.music.audio_name}
        timecode={game.music.timecode}
      />
    );
  }

  function renderClues() {
    const media = game.music.movie || game.music.tvShow;
    const clues = [];

    if (tries > 0) {
      if (media.release_date) {
        clues.push({ key: 'Année de sortie', value: media.release_date });
      } else if (media.first_air_date) {
        clues.push({
          key: 'Année de sortie',
          value: `${media.first_air_date} - ${
            media.status === 'Returning Series'
              ? 'en cours'
              : media.last_air_date
          }`,
        });
      }
    }

    if (tries > 1) {
      if (media.directors) {
        clues.push({ key: 'Réalisateur', value: addSpaces(media.directors) });
      } else {
        clues.push({
          key: 'Network (chaine, plateforme de VOD)',
          value: media.networks[0],
        });
      }
    }

    if (tries > 2) {
      clues.push({ key: 'Acteurs', value: addSpaces(media.casts) });
    }

    if (tries > 3) {
      clues.push({ key: 'Résumé', value: media.overview });
    }

    if (!clues.length) {
      return;
    }

    return (
      <PaperBox>
        <Typography variant="h5">Indices</Typography>
        <Box>
          {clues.map((clue, index) => {
            return (
              <Stack
                direction="row"
                sx={{ margin: '16px 0' }}
                key={index}
              >
                <div style={{ width: '180px' }}>{clue.key}</div>
                <div style={{ flex: 1 }}>{clue.value}</div>
              </Stack>
            );
          })}
        </Box>
      </PaperBox>
    );
  }

  function renderYesterday() {
    if (isLoading) {
      return;
    }

    if (!data.data.music) {
      return;
    }

    return (
      <PaperBox style={{ marginTop: '24px' }}>
        <Heading type="subtitle">Musique d'hier</Heading>
        <MovieCard
          movie={data.data.music.movie}
          music={data.data.music}
          size="small"
        />
      </PaperBox>
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

  function renderDialogExplication() {
    if (!isRulesOpen) {
      return;
    }

    return (
      <Rules
        timers={TIMERS}
        onClose={() => setRulesOpen(false)}
      />
    );
  }

  function renderDialogStats() {
    if (!isStatsOpen) {
      return;
    }

    return <Stats onClose={() => setStatsOpen(false)} />;
  }
}

Today.propTypes = {
  onSaveHistory: PropTypes.func,
  game: PropTypes.object,
  history: PropTypes.object,
};

Today.defaultProps = {
  onSaveHistory: () => {},
  game: null,
  history: null,
};

export default Today;
