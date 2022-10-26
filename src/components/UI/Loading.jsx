import { CircularProgress, Typography } from '@mui/material';
import { Stack } from '@mui/system';

function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ margin: 'auto', width: '200px', paddingTop: '100px' }}
      >
        <CircularProgress />
        <Typography marginLeft={2}>Chargement...</Typography>
      </Stack>
    </div>
  );
}

export default Loading;
