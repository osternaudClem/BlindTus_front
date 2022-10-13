import {
  Paper,
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { red, green } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

function HistoryDay({ history }) {
  return (
    <Paper elevation={2} className="Scores">
      <Box sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Essais</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">{history.attempts.length}/5</Typography>
          </Grid>
        </Grid>
        <List dense>
          {history.attempts && history.attempts.map((attempt, index) => (
            <div key={`${attempt}-${index}`}>
              <ListItem>
                <ListItemIcon>
                  {history.isWin && index === history.attempts.length - 1
                    ? <CheckIcon sx={{ color: green[300] }} />
                    : <ClearIcon sx={{ color: red[500] }} />
                  }
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  primary={attempt}
                />
              </ListItem>
              <Divider variant="middle" />
            </div>
          ))}
        </List>
      </Box>
    </Paper>
  )
}

export default HistoryDay;