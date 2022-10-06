import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

import {
  historyTodayActions,
} from '../../actions';

function HistoryDay(props) {
  return (
    <Paper elevation={2} className="Scores">
      <Box sx={{ p: 2, }} style={{ marginTop: '-8px' }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Essaie</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">{props.tries}/5</Typography>
          </Grid>
        </Grid>
        <List dense>
          {props.historyToday.today && props.historyToday.today.attempts && props.historyToday.today.attempts.map((attempt, index) => (
            <div key={`${attempt}-${index}`}>
              <ListItem>
                <ListItemIcon>
                  {props.historyToday.today.isWin && index === props.historyToday.today.attempts.length - 1
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

function mapStateToProps(state) {
  return {
    historyToday: state.historyToday,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    historyTodayActions: bindActionCreators(historyTodayActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryDay);