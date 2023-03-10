import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { getCookie } from 'react-use-cookie';
import { Paper, Box, Grid } from '@mui/material';

import { SemiBackgroundContainer } from '../components/Background';

function NotConnected(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie('user');

    if (userId && userId !== '') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Grid
      container
      component="main"
      className="NotLogged"
    >
      <SemiBackgroundContainer />
      <Grid
        item
        sm={12}
        md={6}
        component={Paper}
        elevation={6}
        square
        className="NotLogged__content"
      >
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
  );
}

export default NotConnected;
