import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  TextField,
} from '@mui/material';
import { ChatMessage } from './';
import { useTextfield } from '../../hooks/formHooks';
import './Chat.scss';

function Chat({ messages, onSendChat }) {
  const [chat, onChatChange] = useTextfield();

  const handleSubmitChat = function(event) {
    event.preventDefault();
    onSendChat(chat);
    onChatChange('');
  }
  return (
    <div className="Chat">
      <Grid container>
        <Grid item xs={12} >
          <Typography variant="h5" className="header-message">Chat</Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className="Chat__section">
        {messages.map((message, index) => {
          return <ChatMessage message={message} key={index} />
        })}
        <Divider />
        <Grid container style={{ padding: '20px' }}>
          <Grid item xs={12}>
            <Box component="form" onSubmit={handleSubmitChat}>
              <TextField
                label="Type Something"
                fullWidth
                onChange={onChatChange}
                value={chat}
                // defaultValue={chat}
                />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Chat;