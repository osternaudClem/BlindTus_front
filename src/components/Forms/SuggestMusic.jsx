import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { isYoutubeUrl } from '../../lib/check';
import { formatMoviesSearch } from '../../lib/format';
import { useEffect } from 'react';
import styled from '@emotion/styled';

const STEPS = [null, 'video', 'title', 'author'];

const BottomNavigation = styled('div')`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ $theme }) => $theme.palette.background.paper};
  border-top: solid 1px ${({ $theme }) => $theme.palette.grey.A700};
  padding: 10px;
  z-index: 9;
`;

function SuggestMusic({ onSubmit, movies, tvShows }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [allMovies, updateAllMovies] = useState([]);
  const [newMusic, setNewMusic] = useState({
    category: '',
    author: '',
    timecode: 0,
    title: '',
    video: '',
  });
  const [mediaError, setMediaError] = useState(null);

  const [movie, setMovie] = useState(null);
  const [youtubeUrlError, setYoutubeUrlError] = useState(false);

  useEffect(() => {
    if (movies.all.length && tvShows.all.length) {
      const medias = [...movies.all, ...tvShows.all];

      updateAllMovies(formatMoviesSearch(medias));
    }
  }, [movies.all, tvShows.all]);

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.title} ${option.title_fr}`,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setAutoCompleteOpen(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onChangeMedia = function (value) {
    setMediaError(null);
    setMovie(value);
    setNewMusic({ ...newMusic, category: value.category._id });

    if (value.musics.length >= 3) {
      return setMediaError(
        'La limite de musique pour cette œuvre est atteinte !\nVous ne pouvez pas en ajouter de nouvelles !'
      );
    } else {
      handleNext();
    }
  };

  const onChangeMusic = (event) => {
    setNewMusic({ ...newMusic, [event.target.name]: event.target.value });
    // Check fields format
    if (event.target.name === 'video') {
      setYoutubeUrlError(false);

      // Check youtube url
      if (event.target.value && !isYoutubeUrl(event.target.value)) {
        return setYoutubeUrlError(true);
      }

      // Get timecode if query params exist
      const params = new URLSearchParams(event.target.value);

      if (params.has('t')) {
        setNewMusic((music) => ({
          ...music,
          video: music.video.replace(`&t=${params.get('t')}`, ''),
          timecode: parseInt(params.get('t')) || 0,
        }));
      }
    }
  };

  const handleSubmit = function (event) {
    event.preventDefault();

    if (movie && !youtubeUrlError) {
      if (movie.type === 'movies') {
        onSubmit(newMusic, movie, null);
      } else {
        onSubmit(newMusic, null, movie);
      }
    } else {
      console.log('>>> some error to display');
    }
  };

  return (
    <Grid
      container
      spacing={12}
      sx={{ paddingBottom: '100px' }}
    >
      <Grid
        item
        xs={12}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
          >
            <Step>
              <StepLabel>
                Pour quelle œuvre voulez-vous ajouter une musique ?
              </StepLabel>
              <StepContent>
                <FormControl fullWidth>
                  <Autocomplete
                    value={movie}
                    autoHighlight
                    open={autoCompleteOpen}
                    margin="normal"
                    options={allMovies}
                    onChange={(event, value) => onChangeMedia(value)}
                    onInputChange={(event, value) => {
                      setAutoCompleteOpen(
                        (value.length > 0 && !movie?.title_fr) ||
                          value !== movie.title_fr
                      );
                    }}
                    onClose={() => setAutoCompleteOpen(false)}
                    getOptionLabel={(option) => option.title_fr}
                    filterOptions={filterOptions}
                    renderOption={(props, option) => {
                      return (
                        <li
                          key={`${option._id}-${option.category._id}`}
                          {...props}
                        >
                          <Chip
                            label={option.category.label_fr}
                            color={
                              option.type === 'movies' ? 'success' : 'info'
                            }
                            sx={{ marginRight: '16px' }}
                          />
                          {option.label}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Oeuvre"
                        name="movie"
                        required
                      />
                    )}
                    noOptionsText={<div>Cette oeuvre n'existe pas.</div>}
                  />
                  <FormHelperText>
                    Si le film que vous recherchez n'existe pas, veuillez
                    d'abord l'ajouter{' '}
                    <Link
                      to="/suggest?t=0"
                      style={{ color: 'white' }}
                    >
                      ici
                    </Link>
                    .
                  </FormHelperText>
                  {mediaError ? (
                    <Alert
                      variant="filled"
                      elevation={6}
                      severity="error"
                      sx={{ width: '100%', whiteSpace: 'pre', mt: '10px' }}
                    >
                      {mediaError}
                    </Alert>
                  ) : null}
                </FormControl>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Ajoutez une URL depuis Youtube</StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{ flexGrow: 1, flex: 1 }}
                  >
                    <div>
                      <Typography>
                        Musique déjà ajouté pour <b>{movie?.title_fr}:</b>
                      </Typography>
                      <ul>
                        {movie?.musics.map((music) => (
                          <li key={music._id}>
                            {music.title} ({music.author})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={9}
                    sx={{ flexGrow: 1, flex: 1 }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        label="Liens vers la vidéo Youtube"
                        name="video"
                        variant="outlined"
                        required
                        margin="normal"
                        value={newMusic.video}
                        onChange={onChangeMusic}
                        error={youtubeUrlError}
                        helperText={
                          youtubeUrlError && "Ceci n'est pas un lien youtube !"
                        }
                        sx={{ flexGrow: 1 }}
                      />
                      <FormHelperText>
                        Seulement les liens complets sont acceptés. Pas de
                        youtu.be ou de lien embed. Si le lien comporte déjà un
                        timecode, vous n'avez pas besoin de le préciser.
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex' }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        label="Timecode"
                        name="timecode"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newMusic.timecode}
                        onChange={onChangeMusic}
                        InputProps={{
                          inputProps: {
                            min: 0,
                            style: {
                              WebkitAppearance: 'none',
                              MozAppearance: 'textfield',
                            },
                          },
                          endAdornment: <div>Sec</div>,
                        }}
                        sx={{ flex: 1 }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {newMusic.video && !youtubeUrlError ? (
                  <ReactPlayer
                    url={`${newMusic.video}&t=${newMusic.timecode}`}
                    controls
                    width="60%"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width="60%"
                  >
                    <div style={{ paddingTop: '57%' }} />
                  </Skeleton>
                )}
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Ajoutez le titre de la musique</StepLabel>
              <StepContent>
                <TextField
                  label="Titre"
                  name="title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newMusic.title}
                  onChange={onChangeMusic}
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Ajoutez le(s) auteurs de la musique</StepLabel>
              <StepContent>
                <TextField
                  label="Artiste"
                  name="author"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newMusic.author}
                  onChange={onChangeMusic}
                />
              </StepContent>
            </Step>
          </Stepper>

          <BottomNavigation $theme={theme}>
            <Container
              maxWidth="xl"
              sx={{ display: 'flex' }}
            >
              <Button
                onClick={handleBack}
                variant="outlined"
              >
                Étape précédente
              </Button>

              <Button
                onClick={handleNext}
                disabled={!newMusic[STEPS[activeStep]]}
                variant="outlined"
              >
                Étape suivante
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                type="submit"
                disabled={activeStep < 3 || !newMusic[STEPS[3]]}
                sx={{ marginLeft: 'auto' }}
              >
                Ajouter
              </Button>
            </Container>
          </BottomNavigation>
        </Box>
      </Grid>
    </Grid>
  );
}

SuggestMusic.propTypes = {
  onSubmit: PropTypes.func,
};

SuggestMusic.defaultProps = {
  onSubmit: () => {},
};

export default SuggestMusic;
