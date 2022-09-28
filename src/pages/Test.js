import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  musicsActions,
  scoresActions,
  gamesActions,
} from '../actions';

import {
  CssBaseline,
  Typography,
} from '@mui/material';
import { MovieCard } from '../components/Cards';


function Test(props) {
  useEffect(() => {
  }, []);

  return (
    <div>
      <CssBaseline />
      <Typography variant="h3">Page de test</Typography>

      <MovieCard movie={props.games.currentGame.musics[0].movie} music={props.games.currentGame.musics[0]} />
    </div>
  )
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
    gamesActions: bindActionCreators(gamesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test)