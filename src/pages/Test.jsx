import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import { updateTitle } from '../lib/document';
import { GamePlayer } from '../components/Game';

const AUDIO_NAME = 'michael-kamen-river-chase-bicbyihdnm';

function Test() {
  useEffect(() => {
    updateTitle('Test');
  }, []);

  const onCanPlayAudio = function () {

  }

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

        <Box sx={{ '& button': { m: 1 } }}>
          <GamePlayer
            audioName={AUDIO_NAME}
            canPlay={onCanPlayAudio}
            showControl
          />
        </Box>
      </Container>
    </Box>
  )
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);