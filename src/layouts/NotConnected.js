import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { getCookie } from 'react-use-cookie';
import {
  CssBaseline,
  Paper,
  Box,
  Grid,
} from '@mui/material';

import { SemiBackground } from '../components/Background';
import { HeaderNotLogged } from '../components/Header';

function NotConnected(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie('user');

    if (userId && userId !== '') {
      navigate('/');
    }
  }, [navigate]);


  return (
    <div>
      <CssBaseline />
      <HeaderNotLogged />
      <Grid container component="main" className="NotLogged">
        <SemiBackground />
        <Grid item sm={12} md={6} component={Paper} elevation={6} square className="NotLogged__content">
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Outlet {...props} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default NotConnected;
