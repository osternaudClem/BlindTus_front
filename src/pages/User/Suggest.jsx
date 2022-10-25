import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert, Slide, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import { UserContext } from '../../contexts/userContext';
import { moviesActions, musicsActions } from '../../actions';
import { updateTitle } from '../../lib/document';
import { Heading } from '../../components/UI';
import { SuggestMusic, SuggestMovie } from '../../components/Forms';

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
  }, [props.movies.all, props.moviesActions]);

  const updateTab = function (value) {
    setTab(value);
    navigate(`/suggest?t=${value}`);
  };

  const handleClickSaveMovie = async function (movie) {
    movie.verified = false;
    movie.added_by = user._id;
    const success = await props.moviesActions.suggestMovie(movie);

    if (success._id) {
      await props.moviesActions.getAll();
      toggleSnack();
    }
  };

  const handleSubmitNewMusic = async function (music, movie) {
    music.verified = false;
    music.added_by = user._id;
    music.movie = movie._id;
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
          Film suggéré !
        </Alert>
      </Snackbar>

      <Heading>Suggérer...</Heading>
      <Typography variant="subtitle1">
        Aidez-moi a jouté des films et des musiques. Toutes demandes seront
        vérifiées.
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
        <Tab label="un film" />
        <Tab label="une musique" />
      </Tabs>

      {renderTab()}
    </div>
  );

  function renderTab() {
    switch (tab) {
      case 1:
        return (
          <SuggestMusic
            movies={props.movies.all}
            onSubmit={handleSubmitNewMusic}
          />
        );
      case 0:
      default:
        return <SuggestMovie onAddMovie={handleClickSaveMovie} />;
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
    musicsActions: bindActionCreators(musicsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggest);
