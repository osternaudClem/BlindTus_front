import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton,
  TextField,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { isYoutubeUrl } from '../../lib/check';
import { formatMoviesSearch } from '../../lib/format';

function SuggestMusic({ movies, onSubmit }) {
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [newMusic, setNewMusic] = useState({
    author: '',
    timecode: 0,
    title: '',
    video: '',
  });
  const [movie, setMovie] = useState(null);
  const [youtubeUrlError, setYoutubeUrlError] = useState(false);

  const allMovies = formatMoviesSearch(movies);

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.title} ${option.title_fr}`,
  });

  const onChangeMusic = (event) => {
    setNewMusic({ ...newMusic, [event.target.name]: event.target.value });
    // Check fields format
    if (event.target.name === 'video') {
      setYoutubeUrlError(false);

      // Check youtube url
      if (event.target.value && !isYoutubeUrl(event.target.value)) {
        setYoutubeUrlError(true);
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
      onSubmit(newMusic, movie);
    } else {
      console.log('>>> some error to display');
    }
  };

  return (
    <Grid
      container
      spacing={12}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <FormControl fullWidth>
            <Autocomplete
              value={movie}
              autoHighlight
              open={autoCompleteOpen}
              margin="normal"
              options={allMovies}
              onChange={(event, value) => setMovie(value)}
              onInputChange={(event, value) =>
                setAutoCompleteOpen(value.length > 0)
              }
              onClose={() => setAutoCompleteOpen(false)}
              getOptionLabel={(option) => option.title_fr}
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Film"
                  name="movie"
                  required
                />
              )}
              noOptionsText={
                <div>
                  Ce film n'existe pas.{' '}
                  <Link
                    to="/suggest?t=0"
                    style={{ color: 'white' }}
                  >
                    Ajouter le d'abord
                  </Link>
                  .
                </div>
              }
            />
            <FormHelperText>
              Si le film que vous recherchez n'existe pas, veuillez d'abord
              l'ajouter{' '}
              <Link
                to="/suggest?t=0"
                style={{ color: 'white' }}
              >
                ici
              </Link>
              .
            </FormHelperText>
          </FormControl>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={8}
              sx={{ flexGrow: 1, flex: 1 }}
            >
              <FormControl fullWidth>
                <TextField
                  label="Liens vers la video Youtube"
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
                  Seulement les liens complets sont acceptés. Pas de youtu.be ou
                  de lien embed. Si le lien comporte déjà un timecode, vous
                  n'avez pas besoin de le préciser.
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: 'flex' }}
            >
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
                sx={{ flex: 1, width: '100px' }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Artiste"
            name="author"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMusic.author}
            onChange={onChangeMusic}
          />
          <TextField
            label="Titre"
            name="title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMusic.title}
            onChange={onChangeMusic}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            type="submit"
          >
            Ajouter
          </Button>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={4}
      >
        {newMusic.video && !youtubeUrlError ? (
          <ReactPlayer
            url={`${newMusic.video}&t=${newMusic.timecode}`}
            controls
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width="100%"
          >
            <div style={{ paddingTop: '57%' }} />
          </Skeleton>
        )}
      </Grid>
    </Grid>
  );
}

SuggestMusic.propTypes = {
  movies: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
};

SuggestMusic.defaultProps = {
  onSubmit: () => {},
};

export default SuggestMusic;