import {
  Alert,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  categoriesActions,
  moviesActions,
  musicsActions,
  tvShowsActions,
} from '../../actions';
import { Heading } from '../../components/UI';
import { SuggestMedia, SuggestMusic } from '../../components/Forms';
import { UserContext } from '../../contexts/userContext';
import { useBoolean } from 'usehooks-ts';

function SlideTransition(props) {
  return (
    <Slide
      {...props}
      direction="down"
    />
  );
}

const Suggest = (props) => {
  const [type, setType] = useState('');
  const { value: isSnackOpen, toggle: toggleSnack } = useBoolean(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!props.movies.all.length) {
      props.moviesActions.getAll();
    }
    if (!props.tvShows.all.length) {
      props.tvShowsActions.getTVShows();
    }
    if (!props.categories.all.length) {
      props.categoriesActions.getCategories();
    }
  }, [
    props.movies.all,
    props.moviesActions,
    props.tvShowsActions,
    props.tvShows.all,
    props.categoriesActions,
    props.categories.all,
  ]);

  const onTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleSubmitNewMusic = async function (music, movie, tvShow) {
    music.verified = false;
    music.added_by = user._id;
    music.movie = movie && movie._id;
    music.tvShow = tvShow && tvShow._id;
    music.video = `${music.video}&t=${music.timecode}`;
    music.type = props.categories.all.find(
      (c) => c._id === music.category
    ).type;
    delete music.timecode;

    const success = await props.musicsActions.suggestMusic(music);

    if (success._id) {
      toggleSnack();
      setType('');
    }
  };

  const handleClickSaveMovie = async function (movie, mediaType) {
    movie.verified = false;
    movie.added_by = user._id;
    movie.category = type;
    let success = null;

    if (mediaType === 'movies') {
      success = await props.moviesActions.suggestMovie(movie);
    } else if (mediaType === 'tvShows') {
      success = await props.tvShowsActions.suggestTVShow(movie);
    }
    if (success._id) {
      await props.moviesActions.getAll();
      await props.tvShowsActions.getTVShows();
      toggleSnack();
    }
  };

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
          Œuvre ou musique ajouté !
        </Alert>
      </Snackbar>
      <Heading>Suggérer...</Heading>
      <Typography variant="subtitle1">
        Aidez-moi a ajouté des œuvres et des musiques. Toutes les demandes
        seront vérifiées.
      </Typography>

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
            sx={{ mt: 1 }}
          >
            <Typography gutterBottom>Que voulez-vous ajouter ?</Typography>
            <FormControl sx={{ my: 1, minWidth: 220 }}>
              <InputLabel id="select-category-label">
                Œuvre ou musique ?
              </InputLabel>
              <Select
                labelId="select-category-label"
                value={type}
                label="Œuvre ou musique ?"
                onChange={onTypeChange}
              >
                <MenuItem value={'music'}>Une musique</MenuItem>
                {props.categories.all
                  .filter((c) => c.isDisplaySuggest)
                  .map((category) => (
                    <MenuItem
                      value={category._id}
                      key={category._id}
                    >
                      {category.label_fr}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      {type === 'music' ? (
        <SuggestMusic onSubmit={handleSubmitNewMusic} />
      ) : null}
      {type !== 'music' && type !== '' ? (
        <SuggestMedia
          onAddMedia={handleClickSaveMovie}
          type={props.categories.all.find((c) => c._id === type).type}
        />
      ) : null}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    movies: state.movies,
    tvShows: state.tvShows,
    categories: state.categories,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    moviesActions: bindActionCreators(moviesActions, dispatch),
    tvShowsActions: bindActionCreators(tvShowsActions, dispatch),
    musicsActions: bindActionCreators(musicsActions, dispatch),
    categoriesActions: bindActionCreators(categoriesActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggest);
