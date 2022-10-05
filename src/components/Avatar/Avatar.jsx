import PropTypes from 'prop-types';
import { Avatar, Stack, Typography } from '@mui/material';

function UserAvatar({ avatar, username, displayUsername }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
    >
      {displayUsername === 'left' &&
        <Typography variant="body" marginRight={2}>{username}</Typography>
      }
      <Avatar src={avatar || 'undefined'} alt={username} />
      {displayUsername === 'right' &&
        <Typography variant="body" marginRight={2}>{username}</Typography>
      }
    </Stack>
  )
}

UserAvatar.propTypes = {
  avatar: PropTypes.string,
  displayUsername: PropTypes.oneOf(['none', 'left', 'right']),
  username: PropTypes.string,
};

UserAvatar.defaultProps = {
  avatar: null,
  displayUsername: 'none',
  username: null,
}

export default UserAvatar;