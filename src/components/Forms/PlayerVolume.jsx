import {
  Box,
  Stack,
  Slider,
} from '@mui/material';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

function PlayerVolume({ onChange, value }) {
  return (
    <Box sx={{ width: 160 }}>
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

export default PlayerVolume;