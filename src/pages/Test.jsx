import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import { musicsActions } from '../actions';

function Test() {
  const str = "Crème Brulée"
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

      </Container>
    </Box>
  )
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