import React from 'react';
import { connect } from 'react-redux';

import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

function ScoresDetails(props) {
  const totalPoint = props.scores.currentGame.reduce((accumulator, game) => {
    return accumulator + game.score;
  }, 0);

  return (
    <Box
      sx={{ p: 2 }}
      style={{ marginTop: '-8px' }}
    >
      <Grid
        container
        alignItems="center"
      >
        <Grid
          item
          xs
        >
          <Typography variant="h5">Score</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4">{totalPoint}</Typography>
        </Grid>
      </Grid>
      <List dense>
        {props.scores.currentGame.map((score) => (
          <div key={`${score.movie || score.tvShow} - ${score.score}`}>
            <ListItem
              secondaryAction={
                <Typography variant="body">{score.score}</Typography>
              }
            >
              <ListItemIcon>
                {score.isCorrect && <CheckIcon color="success" />}
                {!score.isCorrect && <ClearIcon sx={{ color: red[500] }} />}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary={score.movie || score.tvShow}
                secondary={`Votre reponse: ${score.playerAnswer}`}
              />
            </ListItem>
            <Divider variant="middle" />
          </div>
        ))}
      </List>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    scores: state.scores,
  };
}

export default connect(mapStateToProps, null)(ScoresDetails);
