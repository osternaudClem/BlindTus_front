import { CircularProgress, Typography } from "@mui/material";
import { Stack } from "@mui/system";

function Loading() {
  return (
    <Stack direction="row" alignItems="center">
      <CircularProgress />
      <Typography marginLeft={2}>Chargement...</Typography>
    </Stack>
  )
}

export default Loading;