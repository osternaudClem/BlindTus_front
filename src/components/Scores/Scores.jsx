import React from 'react';
import { connect } from 'react-redux';

import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { red } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { PaperBox } from '../UI';
import './Scores.scss';

function Scores(props) {
  const totalPoint = props.currentGame.reduce((accumulator, game) => {
    return accumulator + game.score;
  }, 0);

  return (
    <PaperBox className="Scores">
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
          {props.currentGame
            .slice(0)
            .reverse()
            .map((score) => (
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
                  />
                </ListItem>
                <Divider variant="middle" />
              </div>
            ))}
        </List>
      </Box>
    </PaperBox>
  );
}

function mapStateToProps(state) {
  return {
    scores: state.scores,
  };
}

export default connect(mapStateToProps, null)(Scores);
