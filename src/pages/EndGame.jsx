import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scoresActions, musicsActions } from '../actions';
import {
  CssBaseline,
  Button,
  Typography,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';

import { ScoresDetails } from '../components/Scores';

function EndGame(props) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');

  useEffect(() => {
    props.musicsActions.reset();
    props.musicsActions.reset();
  }, [props.musicsActions]);

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  }

  const handleClickShareResults = function () {
    const scores = props.scores.currentGame;
    const game = props.games.currentGame;

    const totalPoint = scores.reduce((accumulator, game) => {
      return accumulator + game.score;
    }, 0);

    const correctAnswer = scores.filter(s => s.isCorrect).length;

    const { resultsEmotes } = generateResults();

    let header = `BlindTus #${game.code} - ${correctAnswer}/${scores.length}\n\n`;

    header = header + resultsEmotes.join('\t') + '\n\n';
    header = header + `Score total: ${totalPoint}\n\n`;
    header = header + `http://localhost:3000/new-game?code=${game.code}`;

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

  const generateResults = function () {
    const scores = props.scores.currentGame;
    let resultsEmotes = [];
    let resultsScores = [];

    scores.map((s) => {
      resultsEmotes.push(s.isCorrect ? '✅' : '❌');
      resultsScores.push(s.score);
      return null;
    });

    return { resultsEmotes, resultsScores };
  }

  return (
    <div>
      <CssBaseline />
      {renderAlert()}
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant="h2">Fin de partie</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleClickShareResults}>Partager le résultat</Button>
        </Grid>
      </Grid>
      <ScoresDetails />
    </div>
  )

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
    scores: state.scores,
    games: state.games,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    scoresActions: bindActionCreators(scoresActions, dispatch),
    musicsActions: bindActionCreators(musicsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EndGame)