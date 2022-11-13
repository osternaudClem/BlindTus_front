import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { CssBaseline, Box, Container, Button } from '@mui/material';

import { updateTitle } from '../lib/document';
import { Heading } from '../components/UI';
import { GamePlayer } from '../components/Game';

function Test() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    updateTitle('Test');
  }, []);

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Heading>Test</Heading>
        {/* {show && ( */}
        <GamePlayer
          audioName="hans-zimmer-a-watchful-guardian-igx5a1ifsds"
          showControl
          isReady={show}
        />
        {/* )} */}

        <Button onClick={() => setShow(true)}>Show</Button>
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
