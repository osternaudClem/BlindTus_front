import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Grid,
} from '@mui/material';
import { moviesActions } from '../../actions';
import { tmdb } from '../../config';
import logo from '../../assets/logo_light.png';
import './Background.scss';

function SemiBackground(props) {
  useEffect(() => {
    if (!props.movies.cover) {
      props.moviesActions.getCover();
    }
  }, [props.movies.cover, props.moviesActions]);

  return (
    <Grid
      item
      sm={false}
      md={6}
      sx={{
        backgroundImage: `url(${tmdb.image_path}${props.movies.cover})`,
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
      }}
      className="LoginPage__cover"
    >
      <img src={logo} alt="BlindTus logo" className="LoginPage__logo" />
    </Grid>
  )
}

function mapStateToProps(state) {
  return {
    movies: state.movies,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    moviesActions: bindActionCreators(moviesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SemiBackground)