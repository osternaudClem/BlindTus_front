import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';

import { socket } from '../context/socket';
import { useTextfield } from '../hooks/formHooks';
import { Box } from '@mui/system';

function Test(props) {
  const [message, onChangeMessage] = useTextfield();
  const [, setUsername] = useState('');
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState('');
  // const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!props.user.username) {
      return;
    }

    const name = props.user.username;
    const roomCode = '1234';

    setUsername(name);
    setRoom(roomCode);

    socket.emit('join', { username: name, room: roomCode }, (error) => {
      if (error) {
        alert(error);
      }
    })
    return () => {
      socket.emit('USER_DISCONNECT');
      socket.off();
      setUsers([]);
    }

  }, [props.user.username]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages, users])

  const sendMessage = function(event) {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => onChangeMessage(''))
    }
  }


  return (
    <div>
      <CssBaseline />
      <Typography variant="h3">Page de test</Typography>
      <Typography variant='body1'>The room is: {room}</Typography>
      <Typography variant='h6'>Users</Typography>
      <ul>
        {users.length && users.map((user, index) => {
          return <li key={index}>{user.username}</li>
        })}
      </ul>
      <Box component="form" onSubmit={sendMessage}>
        <TextField
          onChange={onChangeMessage}
        />
      </Box>
      <ul>
        {messages.map((message, index) => {
          return <li key={index}>{message.user}: {message.text}</li>;
        })}
      </ul>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    user: state.users.me,
  }
}


export default connect(mapStateToProps, null)(Test);