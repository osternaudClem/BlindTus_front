import PropTypes from 'prop-types';
import { Typography, Stack, Chip, Divider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { UserAvatar } from '../Avatar';

function GameRoundResults({ room, round, players }) {
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const { rounds } = room;

  return rounds[round].scores.map((user, index) => {
    const player = players.find((p) => p.username === user.username);
    const isCorrect = user.score > 0;
    return largeScreen
      ? renderLarge(index, user, player, isCorrect)
      : renderSmall(index, user, player, isCorrect);
  });

  function renderLarge(index, user, player, isCorrect) {
    return (
      <Stack
        key={index}
        direction="row"
        alignItems="center"
        style={{ marginTop: '16px' }}
      >
        <div style={{ marginRight: '16px', transform: 'translateY(2px)' }}>
          {isCorrect ? (
            <CheckIcon color="success" />
          ) : (
            <ClearIcon color="error" />
          )}
        </div>

        <UserAvatar
          username={player.username}
          avatar={player.info ? player.info.avatar : null}
          displayUsername="right"
          style={{ width: '200px' }}
        />

        <Divider
          orientation="vertical"
          flexItem
        ></Divider>
        <Typography
          variant="body1"
          style={{ marginLeft: '24px', marginRight: '16px', flexGrow: 1 }}
          className="text--crop"
        >
          {user.answer}
        </Typography>
        <Chip
          variant="outlined"
          label={`+${user.score} points`}
          color={isCorrect ? 'success' : 'error'}
          sx={{ fontSize: '16px' }}
        />
      </Stack>
    );
  }

  function renderSmall(index, user, player, isCorrect) {
    return (
      <div key={index}>
        <Stack
          direction="row"
          alignItems="center"
          style={{ marginTop: '16px' }}
        >
          <div style={{ marginRight: '16px', transform: 'translateY(2px)' }}>
            {isCorrect ? (
              <CheckIcon color="success" />
            ) : (
              <ClearIcon color="error" />
            )}
          </div>

          <UserAvatar
            username={player.username}
            avatar={player.info ? player.info.avatar : null}
            displayUsername="right"
            style={{ width: '200px' }}
          />
        </Stack>
        <Stack
          key={index}
          direction="row"
          alignItems="center"
          style={{ marginTop: '16px' }}
        >
          <Typography
            variant="body1"
            style={{ marginRight: '16px', flexGrow: 1 }}
            className="text--crop"
          >
            {user.answer}
          </Typography>
          <Chip
            variant="outlined"
            label={`+${user.score} points`}
            color={isCorrect ? 'success' : 'error'}
            sx={{ fontSize: '16px' }}
          />
        </Stack>
        <Divider sx={{ marginTop: '16px' }} />
      </div>
    );
  }
}

GameRoundResults.propTypes = {
  room: PropTypes.object.isRequired,
};

export default GameRoundResults;
