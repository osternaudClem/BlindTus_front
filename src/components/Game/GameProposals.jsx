import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Button
} from '@mui/material';

function GameProposals({ proposals, onClick }) {
  const stack = [];

  for (let i = 0; i < 4; i++) {
    stack.push(
      <Stack
        key={i}
        direction="row"
      >
        {renderProposalsButton(i * 2)}
      </Stack>
    );
  }

  return (
    <Box sx={{ '& button': { m: 1 } }}>
      {stack}
    </Box>
  )

  function renderProposalsButton(index) {
    const buttons = [];

    for (let i = 0; i < 2; i++) {
     
      buttons.push(
        <Button
          key={i}
          variant="outlined"
          sx={{ flex: 1 }}
          size="large"
          color="inherit"
          onClick={(event) => onClick(proposals[index + i])}
        >
          {proposals[index + i]}
        </Button>
      );
    }

    return (
      <React.Fragment>
        {buttons}
      </React.Fragment>
    )
  }
}

GameProposals.propTypes = {
  proposals: PropTypes.array,
  onClick: PropTypes.func,
}

GameProposals.defaultProps = {
  proposals: [],
  onClick: () => { },
}

export default GameProposals;