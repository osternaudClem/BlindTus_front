import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import stringSimilarity from 'string-similarity';
import { useCopyToClipboard } from 'usehooks-ts';
import {
  Button,
  CssBaseline,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Divider,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Player } from '../Player';
import { Timer } from '../Timer';
import { Steps } from '../Steps';
import { CircleButton } from '../Buttons';
import { HistoryDay } from '../History';
import { Result } from '../Results';
import { useTextfield } from '../../hooks/formHooks';
import { addLeadingZeros } from '../../lib/number';
import { MovieTextField } from '../Forms';

const TIMERS = [10, 25, 40, 70, 120];
// const TIMERS = [3, 3, 3, 3, 3];

const STEPS = {
  BEGINING: 'begining',
  PLAYING: 'playing',
  ENDED: 'ended',
};

function Today({ onSaveHistory, game, history }) {
  const [step, setStep] = useState(STEPS['BEGINING'])
  const [open, setOpen] = useState(false);
  const [tries, setTries] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [inputDisabled, setInputDisabled] = useState(true);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [, copyToClipBoard] = useCopyToClipboard();
  const answerField = useRef(null);

  useEffect(() => {
    setIsCorrect(history.isWin);
    setTries(history.attempts && history.attempts.length);
  }, [history]);

  useEffect(() => {
    if (!inputDisabled) {
      answerField.current.focus();
    }
  }, [inputDisabled]);

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickNext = function () {
    setStep(STEPS['PLAYING']);
    setInputDisabled(false);
    setDisplayGame(true);
    setDisplayTimer(true);
    setIsCorrect(null);
    answerField.current.focus();
  }

  const onTimerTick = function (tick) {
    if (tick === 0) {
      updateAnswer('');
      onSaveHistory('', false);
      setInputDisabled(true);
      setDisplayTimer(false);
      setDisplayGame(false);
      setTries(s => s + 1);
    }
  }

  const onSendAnswer = event => {
    if (event) {
      event.preventDefault();
    }

    const movie = game.music.movie;
    if (inputDisabled) {
      return;
    }

    setInputDisabled(true);

    const titles = [movie.title, movie.title_fr, ...movie.simple_title];

    let isCorrect = false;

    titles.map(title => {
      const similarity = stringSimilarity.compareTwoStrings(title.toLowerCase(), answer.toLowerCase());

      if (similarity >= 0.8) {
        isCorrect = true;
      }

      return null;
    });

    setIsCorrect(isCorrect);
    
    onSaveHistory(answer, isCorrect);
    
    updateAnswer('');
    setDisplayTimer(false);
    setDisplayGame(false);
    setTries(s => s + 1);
    
    if (tries === 4) {
      setStep(STEPS['ENDED']);
    }
  }

  const handleClickShareResult = async function () {
    let header = `🎬 BlindTus 🍿 #${addLeadingZeros(game.totalTodays, 3)}\n\n`;

    for (let i = 0; i < 5; i++) {
      // Wrong ❌
      // Correct ✅
      // Other tries ⬛
      let emote = '⬛';

      if (history.attempts.length === i + 1) {
        emote = '✅';
      }
      else if (history.attempts.length > i + 1) {
        emote = '❌';
      }

      header = header + `${emote}`;
    }

    header = header + `\n\nhttp://blindtus.cl3tus.com/today`;

    const isCopied = await copyToClipBoard(header);

    if (isCopied) {
      setAlertTitle('Résumé copié dans le presse-papier.')
    }
    else {
      setAlertTitle('Votre navigateur n\'est pas compatible.');
    }

    setIsAlertOpen(true);
  }

  if (!game || !history) {
    return <div>Chargement...</div>
  }

  return (
    <Grid container spacing={12} component="main" className="LoginPage">
      <CssBaseline />
      {renderAlert()}
      <Grid
        item
        xs={12}
        sm={9}
        md={8}
      >
        <Typography component="h1" variant="h3" align="center" marginBottom={2}>
          Musique du jour
          <IconButton onClick={handleClickOpen}>
            <HelpIcon />
          </IconButton>
        </Typography>

        <Typography component="p" variant="subtitle2" align="center" marginBottom={10}>Vous ne pouvez entrer le nom du film que pendant la lecture</Typography>

        {endedGame()}
        {renderGame()}

        {renderPlayer()}
        {renderDialogExplication()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={4}
      >
        <HistoryDay history={history} />
      </Grid>
    </Grid>
  )

  function renderGame() {
    if (history.isCompleted) {
      return;
    }

    return (
      <div>
        <Steps steps={[1, 2, 3, 4, 5]} active={tries} correct={history.today && history.today.isWin && history.today.attempts.length} />
        {displayTimer && step !== 'ENDED' &&
          <Timer limit={TIMERS[tries]} key={`timer-${tries}`} onFinished={onTimerTick} />
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
          <MovieTextField
            inputRef={answerField}
            onChange={updateAnswer}
            value={answer}
            isCorrect={isCorrect}
            disabled={inputDisabled}
          />
        </Box>
        {!displayGame &&
          <Box align="center">
            <CircleButton onClick={handleClickNext} />
          </Box>
        }
      </div>
    )
  }

  function endedGame() {
    if (!history.isCompleted) {
      return;
    }

    return (
      <div>
        <Alert variant="outlined">La partie est finie pour aujourd'hui. Revenez demain !</Alert>
        <Box sx={{ margin: '24px 0'}}>
          <Button variant="contained" onClick={handleClickShareResult}>Partager le résultat</Button>
        </Box>
        <Result movie={game.music.movie} music={game.music} />
      </div>
    )
  }

  function renderPlayer() {
    if (!displayGame) {
      return;
    }

    return (
      <Player url={game.music.video} />
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
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {alertTitle}
        </Alert>
      </Snackbar>
    )
  }

  function renderDialogExplication() {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Règles
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            Vous avez <b>5</b> essaie pour trouver la musique du jour.
          </DialogContentText>
          <DialogContentText>
            Le mode de jeu est en "Facile". C'est-à-dire que le nom du film peut être un raccourci.
          </DialogContentText>
          <DialogContentText>
            Examples:
          </DialogContentText>
          <ul>
            <li>2001, l'Odyssée de l'espace <ArrowForwardIcon /> 2001</li>
            <li>Le Seigneur des anneaux : La Communauté de l'anneau <ArrowForwardIcon /> Le Seigneur des anneaux</li>
          </ul>

          <DialogContentText>
            À chaque étape, vous avez du temps supplémentaires:
          </DialogContentText>
          <ol>
            <li>{TIMERS[0]} secondes</li>
            <li>{TIMERS[1]} secondes</li>
            <li>{TIMERS[2]} secondes</li>
            <li>{TIMERS[3]} secondes</li>
            <li>{TIMERS[4]} secondes</li>
          </ol>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant="contained">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    )
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