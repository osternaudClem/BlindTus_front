import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import { updateTitle } from '../lib/document';

function Test() {
  useEffect(() => {
    updateTitle('Test');
  }, []);

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

        <Box sx={{ '& button': { m: 1 } }}>
          
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