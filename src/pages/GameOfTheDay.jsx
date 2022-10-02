import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import stringSimilarity from 'string-similarity';
import ReactPlayer from 'react-player/youtube';
import { getCookie } from 'react-use-cookie';
import {
  Button,
  CssBaseline,
  Typography,
  Box,
  TextField,
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
import { Timer } from '../components/Timer';
import { Steps } from '../components/Steps';
import { CircleButton } from '../components/Buttons';
import { HistoryDay } from '../components/History';
import { Result } from '../components/Results';
import { useTextfield } from '../hooks/formHooks';
import { UserContext } from '../contexts/userContext';

const TIMERS = [5, 10, 15, 25, 60];
// const TIMERS = [5, 4, 3, 4, 3];
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
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const { user } = useContext(UserContext);
  const userId = getCookie('user');

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  }

  useEffect(() => {
    (async function () {
      if (!props.today.game) {
        await props.todayActions.getMusic();
      }

      if (!props.historyToday.today._id) {
        const game = await props.historyTodayActions.getTodayUser(userId);
        if (game) {
          setIsCorrect(game.isWin);
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

  const handleClickShareResult = function () {
    let header = `BlindTus #001 - ${props.historyToday.today.isWin ? `${props.historyToday.today.attempts.length}/5` : 'Film non trouvé'}\n\n`;
    header = header + `http://localhost:3000/today`;

    new Promise((resolve, reject) => {
      if (window.navigator.clipboard !== undefined) {
        return resolve(window.navigator.clipboard.writeText(header));
      }
      return reject();
    })
      .catch(
        () =>
          new Promise((resolve, reject) => {
            if (window.navigator.share !== undefined) return resolve(navigator.share({ text: header }));

            return reject();
          })
      )
      .then(() => {
        setAlertTitle('Résumé copié dans le presse-papier.')
      })
      .catch((error) => {
        setAlertTitle('Votre navigateur n\'est pas compatible.');
      });

    setIsAlertOpen(true);
  }

  let color = "primary";

  if (isCorrect) {
    color = "success";
  } else if (isCorrect !== null) {
    color = "error";
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
        <Typography component="h1" variant="h3" align="center" marginBottom={10}>
          Musique du jour
          <IconButton onClick={handleClickOpen}>
            <HelpIcon />
          </IconButton>
        </Typography>

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
        <HistoryDay />
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
          <TextField
            onChange={updateAnswer}
            value={answer}
            placeholder="Tape le nom du film"
            fullWidth
            autoFocus
            color={color}
            InputProps={{
              disabled: inputDisabled,
              style: { height: '80px', fontSize: '24px' }
            }}
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
    if (!props.historyToday.today || !props.historyToday.today.isCompleted) {
      return;
    }

    return (
      <div>
        <Typography>La partie est finie pour aujourd'hui. Revenez demain !</Typography>
        <Button variant="contained" onClick={handleClickShareResult}>Partager le résultat</Button>

        <Result movie={props.today.game.music.movie} music={props.today.game.music} />
      </div>
    )
  }

  function renderPlayer() {
    if (!displayGame) {
      return;
    }

    return (
      <div>
        <ReactPlayer
          url={props.today.game.music.video}
          playing={true}
          style={{
            position: 'fixed',
            top: '-1000px',
            left: '-1000px'
          }}
        />
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