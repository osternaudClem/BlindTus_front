import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useCopyToClipboard } from 'usehooks-ts';
import {
  CssBaseline,
  Button,
  Snackbar,
  Alert,
  Grid,
  Stack,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import IosShareIcon from '@mui/icons-material/IosShare';
import ReplayIcon from '@mui/icons-material/Replay';
import FlareIcon from '@mui/icons-material/Flare';

import { updateTitle } from '../../lib/document';
import { scoresActions, musicsActions } from '../../actions';
import { ScoresDetails } from '../../components/Scores';
import { Heading, PaperBox } from '../../components/UI';

function EndGame(props) {
  const [, copyToClipBoard] = useCopyToClipboard();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const navigate = useNavigate();
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));

  useEffect(() => {
    updateTitle('Fin de partie');
  }, []);

  useEffect(() => {
    props.musicsActions.reset();
  }, [props.musicsActions]);

  const handleCloseAlert = function () {
    setIsAlertOpen(false);
  };

  const handleClickShareResults = async function () {
    const scores = props.scores.currentGame;
    const game = props.games.currentGame;

    const categories = game.categories.map(
      (c) => props.categories.all.find((k) => k._id === c).label_fr
    );

    const totalPoint = scores.reduce((accumulator, game) => {
      return accumulator + game.score;
    }, 0);

    const correctAnswer = scores.filter((s) => s.isCorrect).length;

    const { resultsEmotes } = generateResults();

    let header = `BlindTus #${game.code} - ${correctAnswer}/${scores.length}\n\n`;

    header = header + resultsEmotes.join('\t') + '\n\n';
    header = header + `Score total: ${totalPoint}\n\n`;
    header = header + `Categories: ${categories.join(' | ')}\n\n`;
    header = header + `https://blindtus.com/game?code=${game.code}`;

    const isCopied = await copyToClipBoard(header);

    if (isCopied) {
      setAlertTitle('Résumé copié dans le presse-papier.');
    } else {
      setAlertTitle("Votre navigateur n'est pas compatible.");
    }

    setIsAlertOpen(true);
  };

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
  };

  return (
    <div>
      <CssBaseline />
      {renderAlert()}
      <Grid
        container
        alignItems={largeScreen ? 'center' : 'left'}
        direction={largeScreen ? 'row' : 'column'}
      >
        <Grid
          item
          xs
        >
          <Heading>Fin de partie</Heading>
        </Grid>
        <Grid item>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/game?code=${props.games.currentGame.code}`)
              }
              startIcon={<ReplayIcon />}
            >
              Rejouer la partie
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/game')}
              startIcon={<FlareIcon />}
            >
              Nouvelle partie
            </Button>
            <Button
              variant="contained"
              onClick={handleClickShareResults}
              startIcon={<IosShareIcon />}
            >
              Partager le résultat
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <PaperBox>
        <ScoresDetails />
      </PaperBox>
    </div>
  );

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

function mapStateToProps(state) {
  return {
    scores: state.scores,
    games: state.games,
    categories: state.categories,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    scoresActions: bindActionCreators(scoresActions, dispatch),
    musicsActions: bindActionCreators(musicsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EndGame);
