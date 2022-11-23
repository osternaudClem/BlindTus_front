import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CssBaseline, Box, Container, Typography, Button } from '@mui/material';
import { tmdb } from '../config';
import { updateTitle } from '../lib/document';
import { musicsActions } from '../actions';
import { Loading } from '../components/UI';
import { GameImagePixel } from '../components/Game';

const DEFAULT_ZOOM = 5;
const COEF_ZOOM = 10;

function Test(props) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [displayTitle, setDisplayTitle] = useState(false);

  useEffect(() => {
    updateTitle('Test');
    props.musicsActions.getMusics(1);
  }, []);

  const handleClickZoom = function () {
    setZoom((z) => z - 1);
  };

  const handleClickNewImage = function () {
    props.musicsActions.getMusics(1);
    setDisplayTitle(false);
    setZoom(DEFAULT_ZOOM);
  };

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>
        {props.musics.selection.length <= 0 ? (
          <Loading />
        ) : (
          <div>
            <div style={{ width: '100%' }}>
              <GameImagePixel
                src={
                  tmdb.image_path +
                  props.musics.selection[0].movie.backdrop_path
                }
                style={{ width: '100%' }}
                pixelSize={1 * (COEF_ZOOM * zoom)}
              />
            </div>
            {displayTitle && (
              <Typography variant="h4">
                {props.musics.selection[0].movie.title_fr}
              </Typography>
            )}
            <Button
              onClick={handleClickZoom}
              variant="contained"
            >
              Zoom - ({zoom} / {DEFAULT_ZOOM})
            </Button>
            <Button
              onClick={() => setDisplayTitle(true)}
              variant="contained"
            >
              Show title
            </Button>
            <Button
              onClick={handleClickNewImage}
              variant="contained"
            >
              New image
            </Button>
          </div>
        )}
      </Container>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
