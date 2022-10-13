import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Slider,
} from '@mui/material';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

function PlayerVolume({ className, onChange, value }) {
  return (
    <Box className={className}>
      <Stack spacing={2} direction="row"  alignItems="center">
        <VolumeDown />
        <Slider
          value={value}
          onChange={onChange}
        />
        <VolumeUp />
      </Stack>
    </Box>
  );
}

PlayerVolume.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number,
}

PlayerVolume.defaultProps = {
  className: '',
  onChange: () => {},
  value: 70,
}

export default PlayerVolume;