import PropTypes from 'prop-types';
import { Avatar, Badge, Stack, Typography } from '@mui/material';

function UserAvatar({ avatar, badge, username, displayUsername, style }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      style={style}
      data-testid="test-UserAvatar"
    >
      {displayUsername === 'left' && (
        <Typography
          variant="body"
          marginRight={2}
        >
          {username}
        </Typography>
      )}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={badge}
      >
        <Avatar
          src={avatar || 'undefined'}
          alt={username}
        />
      </Badge>
      {displayUsername === 'right' && (
        <Typography
          variant="body"
          marginRight={2}
          className="text--crop"
        >
          {username}
        </Typography>
      )}
    </Stack>
  );
}

UserAvatar.propTypes = {
  avatar: PropTypes.string,
  displayUsername: PropTypes.oneOf(['none', 'left', 'right']),
  style: PropTypes.object,
  username: PropTypes.string,
};

UserAvatar.defaultProps = {
  avatar: null,
  displayUsername: 'none',
  style: {},
  username: null,
};

export default UserAvatar;
