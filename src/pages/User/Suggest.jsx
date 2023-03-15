import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert, Slide, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import { UserContext } from '../../contexts/userContext';
import {
  moviesActions,
  tvShowsActions,
  musicsActions,
  categoriesActions,
} from '../../actions';
import { updateTitle } from '../../lib/document';
import { Heading } from '../../components/UI';
import { SuggestMusic, SuggestMedia } from '../../components/Forms';

function SlideTransition(props) {
  return (
    <Slide
      {...props}
      direction="down"
    />
  );
}

function Suggest(props) {
  const [tab, setTab] = useState(0);
  const { value: isSnackOpen, toggle: toggleSnack } = useBoolean(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    updateTitle('Suggérer un film');
  }, []);

  useEffect(() => {
    const urlTab = searchParams.get('t');
    if (urlTab) {
      setTab(parseInt(urlTab));
    }
  }, [searchParams]);

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

  const updateTab = function (value) {
    setTab(value);
    navigate(`/suggest?t=${value}`);
  };

  const handleClickSaveMovie = async function (movie, type) {
    const category = props.categories.all.find((c) => c.type === type);
    movie.verified = false;
    movie.added_by = user._id;
    movie.category = [category._id];
    let success = null;

    if (type === 'movies') {
      success = await props.moviesActions.suggestMovie(movie);
    } else if (type === 'tvShows') {
      success = await props.tvShowsActions.suggestTVShow(movie);
    }
    if (success._id) {
      await props.moviesActions.getAll();
      await props.tvShowsActions.getTVShows();
      toggleSnack();
    }
  };

  const handleSubmitNewMusic = async function (music, movie, tvShow) {
    music.verified = false;
    music.added_by = user._id;
    music.movie = movie && movie._id;
    music.tvShow = tvShow && tvShow._id;
    music.video = `${music.video}&t=${music.timecode}`;
    delete music.timecode;

    const success = await props.musicsActions.suggestMusic(music);

    if (success._id) {
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
          Film/Série suggéré !
        </Alert>
      </Snackbar>

      <Heading>Suggérer...</Heading>
      <Typography variant="subtitle1">
        Aidez-moi a jouté des oeuvres et des musiques. Toutes les demandes
        seront vérifiées.
      </Typography>

      <Tabs
        value={tab}
        onChange={(event, value) => updateTab(value)}
        TabIndicatorProps={{ sx: { display: 'none' } }}
        sx={{
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
          mb: '16px',
        }}
      >
        {props.categories.all.find((c) => c.slug === 'movies')
          ?.isDisplaySuggest ? (
          <Tab label="un film" />
        ) : null}

        {props.categories.all.find((c) => c.slug === 'tv-shows')
          ?.isDisplaySuggest ? (
          <Tab label="une série" />
        ) : null}

        <Tab label="une musique" />
      </Tabs>

      {renderTab()}
    </div>
  );

  function renderTab() {
    switch (tab) {
      case 1:
        return (
          <SuggestMedia
            onAddMedia={handleClickSaveMovie}
            type="tvShows"
          />
        );
      case 2:
        return <SuggestMusic onSubmit={handleSubmitNewMusic} />;
      case 0:
      default:
        return (
          <SuggestMedia
            onAddMedia={handleClickSaveMovie}
            type="movies"
          />
        );
    }
  }
}

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
