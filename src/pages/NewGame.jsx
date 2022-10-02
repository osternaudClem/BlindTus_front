import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  musicsActions,
  scoresActions,
  gameSettingsActions,
  gamesActions,
  historyActions,
} from '../actions';
import ReactPlayer from 'react-player/youtube';
import stringSimilarity from 'string-similarity';
import {
  CssBaseline,
  TextField,
  Grid,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';

import { Timer } from '../components/Timer';
import { Result } from '../components/Results';
import { Scores } from '../components/Scores';
import { GameSettings } from '../components/Forms';
import { useTextfield } from '../hooks/formHooks';
import { UserContext } from '../contexts/userContext';
import './Page.scss';

const TIMER_PENDING = 5;
const TIMER_GAME = 10;

function NewGame(props) {
  const [isStarted, setIsStarted] = useState(false);
  const [musicNumber, setMusicsNumber] = useState(0);
  const [answer, updateAnswer] = useTextfield();
  const [isCorrect, setIsCorrect] = useState(null);
  const [displayGame, setDisplayGame] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [timer, setTimer] = useState(TIMER_PENDING);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIMER_GAME);
  const [timeLimit, setTimeLimit] = useState(TIMER_GAME);
  const [difficulty, setDifficulty] = useState('easy');
  const [totalMusics, setTotalMusics] = useState(5);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');

  useEffect(() => {
    props.scoresActions.reset();
    if (code) {
      (async function () {
        await props.gamesActions.getGame(code);
      })();
    }

  }, [props.scoresActions, props.gamesActions, code]);

  const getMusics = async function (limit) {
    if (props.musics.selection.length > 0) {
      return;
    }

    return await props.musicsActions.getMusics(limit);
  }

  const onStartGame = async function ({ time, movieNumber, difficulty }) {
    const musics = await getMusics(movieNumber);

    props.gamesActions.saveGame({
      round_time: time,
      difficulty,
      musics,
    });

    setIsStarted(true);
    setDisplayTimer(true);
  }

  const handleClickStart = function () {
    setIsStarted(true);
    setDisplayTimer(true);
  }

  const onSettingsSaved = function (settings) {
    setTimeLimit(settings.time);
    setDifficulty(settings.difficulty);
    setTotalMusics(settings.movieNumber);

    onStartGame(settings);
  }

  const onSendAnswer = event => {
    const music = musicNumber;
    const movie = props.games.currentGame.musics[music].movie;
    let score = 0;

    if (event) {
      event.preventDefault();
    }

    if (inputDisabled) {
      return;
    }

    let titles = [movie.title, movie.title_fr];

    if (difficulty === 'easy') {
      titles = [...titles, ...movie.simple_title];
    }

    let isCorrect = false;

    titles.map(title => {
      const similarity = stringSimilarity.compareTwoStrings(title.toLowerCase(), answer.toLowerCase());

      if (similarity >= 0.8) {
        isCorrect = true;
      }

      return null;
    });

    setIsCorrect(isCorrect);

    if (isCorrect) {
      score = timeLeft * 100 / timeLimit;
    }

    props.scoresActions.addScore({
      movie: movie.title_fr,
      isCorrect,
      score: Math.round(score),
      playerAnswer: answer,
      movie_id: props.games.currentGame.musics[music].movie._id,
      music_id: props.games.currentGame.musics[music]._id,
    });

    onTimerFinished(0, false);
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
        {renderButton()}
        {game()}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={4}
      >
        {isStarted &&
          <Scores />
        }
      </Grid>
    </Grid>
  )

  function renderButton() {
    if (isStarted) {
      return;
    }

    if (code) {
      return (
        <Paper elevation={2} sx={{ width: '600px' }}>
          <Box sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="h5">Parametre de la partie</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">{code}</Typography>
              </Grid>
            </Grid>
            <List>
              <div>
                <ListItem
                  secondaryAction={
                    <Typography variant="body">{props.games.currentGame.round_time}</Typography>
                  }
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary="Temps des manches"
                  />
                </ListItem>
                <Divider variant="middle" />
              </div>

              <div>
                <ListItem
                  secondaryAction={
                    <Typography variant="body">{props.games.currentGame.difficulty}</Typography>
                  }
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary="Difficulté"
                  />
                </ListItem>
                <Divider variant="middle" />
              </div>

              <div>
                <ListItem
                  secondaryAction={
                    <Typography variant="body">{props.games.currentGame.musics && props.games.currentGame.musics.length}</Typography>
                  }
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary="Nombre de musiques"
                  />
                </ListItem>
                <Divider variant="middle" />
              </div>
            </List>
            <Button onClick={handleClickStart} variant="contained" sx={{ marginTop: '24px' }}>Lancer la partie</Button>
          </Box>
        </Paper>
      );
    }

    return (
      <GameSettings onSettingsSaved={onSettingsSaved} />
    );
  }

  function game() {
    if (!isStarted || !props.games.currentGame.musics || props.games.currentGame.musics.length === 0) {
      return;
    }

    let color = "primary";

    if (isCorrect) {
      color = "success";
    } else if (isCorrect !== null) {
      color = "error";
    }

    return (
      <div>
        <div>{musicNumber} / {props.games.currentGame.musics.length}</div>

        {renderTimer()}

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
            disabled={inputDisabled}
            InputProps={{
              style: { height: '80px', fontSize: '24px' }
            }}
          />
        </Box>

        {renderPlayer()}
      </div>
    );
  }

  function renderPlayer() {
    if (!displayGame) {
      if (musicNumber > 0) {
        return (
          <Result movie={props.games.currentGame.musics[musicNumber - 1].movie} music={props.games.currentGame.musics[musicNumber - 1]} />
        )
      }
      return;
    }

    return (
      <div>
        <ReactPlayer
          url={props.games.currentGame.musics[musicNumber].video}
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

  function renderTimer() {
    if (!displayTimer) {
      return;
    }

    return (
      <Timer limit={timer} onFinished={(count) => onTimerFinished(count)} key={timer} className="NewGame__timer" />
    );
  }

  function onTimerFinished(count, sending = true) {
    setTimeLeft(count);
    if (count === 0) {
      if (musicNumber >= totalMusics) {
        props.historyActions.saveHistory({
          scores: props.scores.currentGame,
          user: user,
          game: props.games.currentGame,
        })
        navigate('/end-game');
        return;
      }

      if (displayGame) {
        if (sending) {
          onSendAnswer();
        }
        setTimer(TIMER_PENDING);
        setDisplayGame(false);
        setInputDisabled(true);
        setMusicsNumber(musicNumber + 1);
        updateAnswer('');
      } else {
        setInputDisabled(false);
        setTimer(timeLimit);
        setIsCorrect(null);
        setDisplayGame(true);
      }
    }
  };
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
    scores: state.scores,
    games: state.games,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
    scoresActions: bindActionCreators(scoresActions, dispatch),
    gameSettingsActions: bindActionCreators(gameSettingsActions, dispatch),
    gamesActions: bindActionCreators(gamesActions, dispatch),
    historyActions: bindActionCreators(historyActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame)