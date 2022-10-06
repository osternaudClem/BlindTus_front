import React, { useContext, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import stringSimilarity from 'string-similarity';
import { useCopyToClipboard } from 'usehooks-ts';
import { getCookie } from 'react-use-cookie';
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

import {
  todayActions,
  historyTodayActions,
} from '../actions';
import { Player } from '../components/Player';
import { Timer } from '../components/Timer';
import { Steps } from '../components/Steps';
import { CircleButton } from '../components/Buttons';
import { HistoryDay } from '../components/History';
import { Result } from '../components/Results';
import { useTextfield } from '../hooks/formHooks';
import { UserContext } from '../contexts/userContext';
import { addLeadingZeros } from '../lib/number';
import { MovieTextField } from '../components/Forms';

const TIMERS = [5, 10, 15, 25, 60];
const STEPS = {
  BEGINING: 'begining',
  PLAYING: 'playing',
  ENDED: 'ended',
};

function GameOfTheDay(props) {
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
  const { user } = useContext(UserContext);
  const userId = getCookie('user');
  const answerField = useRef(null);

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  }

  useEffect(() => {
    (async function () {
      if (!props.today.game) {
        const music = await props.todayActions.getMusic();
      console.log('>>> music', music);
      }

      if (!props.historyToday.today._id) {
        const game = await props.historyTodayActions.getTodayUser(userId);
        console.log('>>> game', game)

        if (game) {
          setIsCorrect(game.isWin || null);
          setTries(game.attempts.length);

          if (game.attempts.length === 0) {
            setStep(STEPS['BEGINING']);
          }
          else if (game.attempts.length < 5) {
            setStep(STEPS['PLAYING']);
          }
          else {
            setStep(STEPS['ENDED']);
          }
        } else {
          await props.historyTodayActions.saveHistory({
            today: props.today.game._id,
            user: userId,
          });
        }
      } else {
        setIsCorrect(props.historyToday.today.isWin);
        setTries(props.historyToday.today.attempts && props.historyToday.today.attempts.length);
      }
    })();
  }, [props.today.game, props.historyToday.today, userId, props.historyTodayActions, props.todayActions]);

  useEffect(() => {
    if (!inputDisabled) {
      answerField.current.focus();
    }
  }, [inputDisabled])

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

  const saveHistory = async function (answer, isCorrect) {
    const attempts = props.historyToday.today && props.historyToday.today.attempts ? JSON.parse(JSON.stringify(props.historyToday.today.attempts)) : [];
    attempts.push(answer);

    props.historyTodayActions.saveHistory({
      ...props.historyToday.today,
      today: props.today.game._id,
      user: user._id,
      attempts,
      isWin: isCorrect,
      isCompleted: isCorrect || (props.historyToday.today && props.historyToday.today.attempts.length === 4),
    });
  }

  const onTimerTick = function (tick) {
    if (tick === 0) {
      updateAnswer('');
      saveHistory('', false);
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

    const movie = props.today.game.music.movie;
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
    saveHistory(answer, isCorrect);

    updateAnswer('');
    setDisplayTimer(false);
    setDisplayGame(false);
    setTries(s => s + 1);

    if (tries === 4) {
      setStep(STEPS['ENDED']);
    }
  }

  const handleClickShareResult = async function () {
    const game = props.today.game;
    const history = props.historyToday.today;

    let header = `BlindTus #${addLeadingZeros(game.totalTodays, 3)} - ${history.today.isWin ? `${history.today.attempts.length}/5` : 'Film non trouvé'}\n\n`;

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

  if (!props.today.game || !props.historyToday.today._id) {
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
        <HistoryDay tries={tries} />
      </Grid>
    </Grid>
  )

  function renderGame() {
    if (props.historyToday.today && props.historyToday.today.isCompleted) {
      return;
    }

    return (
      <div>
        <Steps steps={[1, 2, 3, 4, 5]} active={tries} correct={props.historyToday.today && props.historyToday.today.isWin && props.historyToday.today.attempts.length} />
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
    if (!props.historyToday.today._id || !props.historyToday.today.isCompleted) {
      return;
    }

    console.log('>>> props.today', props.today.game)

    return (
      <div>
        <Alert variant="outlined">La partie est finie pour aujourd'hui. Revenez demain !</Alert>
        <Box sx={{ margin: '24px 0'}}>
          <Button variant="contained" onClick={handleClickShareResult}>Partager le résultat</Button>
        </Box>
        <Result movie={props.today.game.music.movie} music={props.today.game.music} />
      </div>
    )
  }

  function renderPlayer() {
    if (!displayGame) {
      return;
    }

    return (
      <Player url={props.today.game.music.video} />
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
            <li>5 secondes</li>
            <li>10 secondes</li>
            <li>15 secondes</li>
            <li>25 secondes</li>
            <li>60 secondes</li>
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

function mapStateToProps(state) {
  return {
    today: state.today,
    historyToday: state.historyToday,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    todayActions: bindActionCreators(todayActions, dispatch),
    historyTodayActions: bindActionCreators(historyTodayActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOfTheDay)