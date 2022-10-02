import {
  Grid,
} from '@mui/material';

function ChatMessage({ message }) {
  return (
    <Grid container>
      <Grid item xs={4} className="Chat__avatar">
        {message.user}
      </Grid>
      <Grid item xs={8} className="Chat__message">
        {message.text}
      </Grid>
    </Grid>
  )
}

export default ChatMessage;