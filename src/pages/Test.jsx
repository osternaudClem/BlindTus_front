import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPlayer from 'react-player';
import axios from 'axios';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';

function Test() {

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

        <Box sx={{ '& button': { m: 1 } }}>
          <iframe id="ytplayer" type="text/html" width="720" height="405"
            src="https://www.youtube.com/embed/-yOZEiHLuVU"
            frameborder="0" allowfullscreen/>

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