import React, { useEffect, useContext } from 'react';
import classnames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoolean, useStep } from 'usehooks-ts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import { UserContext } from '../contexts/userContext';
import { useTextfield } from '../hooks/formHooks';
import { moviesActions } from '../actions';
import { isMovieAlreadyAdded } from '../lib/check';
import { tmdb } from '../config';

const steps = ['Rechercher un film', 'Séléctionner le film', 'Sauvergarder'];

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

function SuggestMovie(props) {
  const [currentStep, step] = useStep(3);
  const {value: isSnackOpen, toggle: toggleSnack} = useBoolean(false);
  const [query, onChangeQuery] = useTextfield();
  const { movie_id, movie_query } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.movies.all.length) {
      props.moviesActions.getAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    if (movie_query) {
      step.setStep(2);
      onChangeQuery(movie_query);
      props.moviesActions.findMovies(movie_query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie_query]);

  useEffect(() => {
    if (movie_id) {
      step.setStep(3);
    }

    if (props.movies.search.length === 0 && movie_id) {
      props.moviesActions.saveSelectedMovie(movie_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie_id]);

  const onSearchMovies = async function (event) {
    event.preventDefault();

    if (query !== '') {
      navigate(`/suggest-movie/${query}`);
    }
  }

  const handleClickMovie = async function (movie) {
    await props.moviesActions.saveSelectedMovie(movie.id);
    navigate(`/suggest-movie/${query}/${movie.id}`);
  }

  const handleClickSaveMovie = async function (movie) {
    movie.verified = false;
    movie.added_by = user._id;
    const success = await props.moviesActions.saveMovie(movie);

    if (success._id) {
      step.setStep(3);
      toggleSnack();

      setTimeout(() => {
        step.setStep(1);
        props.moviesActions.reset();
        navigate(`/suggest-movie`);
      }, 2000);
    }
  }

  return (
    <div>
      <Snackbar
        open={isSnackOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        onClose={toggleSnack}
      >
        <Alert
          variant="filled"
          elevation={6}
          onClose={toggleSnack}
          severity="success"
          sx={{ width: '100%' }}
        >
          Film suggéré !
        </Alert>
      </Snackbar>

      <Typography variant="h1" component="h1" gutterBottom>Suggérer un film</Typography>

      <Stepper activeStep={currentStep - 1}>
        {steps.map(label => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box sx={{ margin: '48px 0' }}>
        {renderSections()}
      </Box>
    </div>
  )

  function renderSections() {
    switch (currentStep) {
      case 1:
      case 2:
        return (
          <div>
            <form onSubmit={onSearchMovies}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <TextField label="Tapez le nom d'un film" variant="outlined" onChange={onChangeQuery} />
              </FormControl>
            </form>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }}>
              {props.movies.search.map(movie => {
                const isAlreadyAdded = isMovieAlreadyAdded(props.movies.all, movie);

                return (
                  <Grid item xs={2} sm={4} md={4} key={movie.id}>
                    <Card sx={{ maxWidth: 365 }} className={classnames('MovieCard', {
                      'MovieCard--exist': isAlreadyAdded,
                    })}>
                      <CardMedia
                        component="img"
                        height="480"
                        image={tmdb.image_path + movie.poster_path}
                        alt={`Poster of ${movie.title} movie`}
                      />

                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {movie.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Year: {movie.release_date && movie.release_date.slice(0, 4)}
                        </Typography>
                      </CardContent>

                      <CardActions>
                        <Button size="small" onClick={() => handleClickMovie(movie)}>Select this movie</Button>
                      </CardActions>

                      {isAlreadyAdded && (
                        <Alert variant="outlined" severity="info" className="MovieCard__info">
                          Movie already added !
                        </Alert>
                      )}
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </div>
        )
      case 3:
        if (!movie_id || !props.movies.search.length) {
          return;
        }

        const movie = props.movies.selected;

        const directors = movie.credits.crew.filter(person => person.job === 'Director');
        const directorNames = [];

        directors.map(director => {
          return directorNames.push(director.name);
        });

        return (
          <Stack
            direction="row"
            spacing={2}
          >
            <img src={tmdb.image_path + movie.poster_path} alt={`poster of ${movie.title} movie`} className="MovieCard__poster" />
            <Stack className="MovieCard__content" justifyContent="space-between">
              <div>
                <Typography variant="h2">{movie.title} - {movie.release_date && movie.release_date.slice(0, 4)}</Typography>
                <Typography variant="h4">{directorNames.map(director => director)}</Typography>
                <Typography variant="body1">{movie.overview}</Typography>
              </div>
              <div>
                <Button variant="contained" onClick={() => handleClickSaveMovie(movie)}>Suggérer ce film</Button>
              </div>
            </Stack>
          </Stack >

        )
      default:
        break;
    }
  }
}

function mapStateToProps(state) {
  return {
    movies: state.movies,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    moviesActions: bindActionCreators(moviesActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggestMovie);