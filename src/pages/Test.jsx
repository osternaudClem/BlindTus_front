import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import { updateTitle } from '../lib/document';
import { Loading } from '../components/UI';


function Test() {
  useEffect(() => {
    updateTitle('Test');
  }, []);

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

        <Loading />
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