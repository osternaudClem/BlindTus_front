import PropTypes from 'prop-types';
import {
  Grid,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import { Heading, PaperBox } from '../UI';

function GameSettingsResume({ game, displayStart, code, onClickStart }) {
  return (
    <PaperBox>
      <Grid
        container
        alignItems="center"
      >
        <Grid
          item
          xs
        >
          <Heading
            type="subtitle"
            marginBottom={0}
          >
            Parametre de la partie
          </Heading>
        </Grid>
        <Grid item>
          <Typography variant="h4">{code}</Typography>
        </Grid>
      </Grid>
      <List>
        <div>
          {game.created_by && (
            <ListItem
              secondaryAction={
                <div>
                  <Stack
                    direction="row"
                    alignItems="center"
                  >
                    <Typography
                      variant="body"
                      marginRight={2}
                    >
                      {game.created_by.username}
                    </Typography>
                    <Avatar
                      src={game.created_by.avatar}
                      alt={game.created_by.username}
                    />
                  </Stack>
                </div>
              }
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Généré par"
              />
            </ListItem>
          )}
          <Divider variant="middle" />
        </div>
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
              <Typography variant="body">
                {game.total_musics || (game.musics && game.musics.length)}
              </Typography>
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
      {displayStart && (
        <Button
          onClick={onClickStart}
          variant="contained"
          sx={{ marginTop: '24px' }}
        >
          Lancer la partie
        </Button>
      )}
    </PaperBox>
  );
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
