import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { CssBaseline, Box, Container, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { updateTitle } from '../lib/document';
import { Heading, Loading } from '../components/UI';

function Test() {
  useEffect(() => {
    updateTitle('Test');
  }, []);

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Heading>Test</Heading>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
            startIcon={<PlayArrowIcon />}
            sx={{ my: 2 }}
          >
            Button
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
