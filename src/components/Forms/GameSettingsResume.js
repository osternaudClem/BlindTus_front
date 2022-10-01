import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';

function GameSettingsResume({ game, displayStart, code, onClickStart }) {
  return (
    <Paper elevation={2} sx={{ width: '600px' }}>
      <Box sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Parametre de la partie</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">{code}</Typography>
          </Grid>
        </Grid>
        <List>
          <div>
            <ListItem
              secondaryAction={
                <Typography variant="body">{game.round_time}</Typography>
              }
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Temps des manches"
              />
            </ListItem>
            <Divider variant="middle" />
          </div>

          <div>
            <ListItem
              secondaryAction={
                <Typography variant="body">{game.difficulty}</Typography>
              }
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Difficulté"
              />
            </ListItem>
            <Divider variant="middle" />
          </div>

          <div>
            <ListItem
              secondaryAction={
                <Typography variant="body">{game.totalMusics || (game.musics && game.musics.length)}</Typography>
              }
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Nombre de musiques"
              />
            </ListItem>
            <Divider variant="middle" />
          </div>
        </List>
        {displayStart &&
          <Button onClick={onClickStart} variant="contained" sx={{ marginTop: '24px' }}>Lancer la partie</Button>
        }
      </Box>
    </Paper>
  )
}

GameSettingsResume.propTypes = {
  game: PropTypes.shape({
    musics: PropTypes.array,
    round_time: PropTypes.number,
    difficulty: PropTypes.string,
  }).isRequired,

  displayStart: PropTypes.bool,
};

GameSettingsResume.defaultProps = {
  displayStart: false,
};

export default GameSettingsResume;