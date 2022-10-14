import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useCopyToClipboard } from 'usehooks-ts';
import {
  CssBaseline,
  Button,
  Typography,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { scoresActions, musicsActions } from '../actions';
import { ScoresDetails } from '../components/Scores';

function EndGame(props) {
  const [, copyToClipBoard] = useCopyToClipboard();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const largeScreen = useMediaQuery(theme => theme.breakpoints.up('md'));

  useEffect(() => {
    props.musicsActions.reset();
    props.musicsActions.reset();
  }, [props.musicsActions]);

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  }

  const handleClickShareResults = async function () {
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
    header = header + `https://blindtus.cl3tus.com/new-game?code=${game.code}`;

    const isCopied = await copyToClipBoard(header);

    if (isCopied) {
      setAlertTitle('Résumé copié dans le presse-papier.')
    }
    else {
      setAlertTitle('Votre navigateur n\'est pas compatible.');
    }

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
      <Grid container alignItems={largeScreen ? 'center' : 'left'} direction={largeScreen ? 'row' : 'column'}>
        <Grid item xs>
          <Typography variant="h2" marginBottom={2}>Fin de partie</Typography>
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