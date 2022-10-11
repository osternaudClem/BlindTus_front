import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { PlayerVolume } from '../Forms';
import logo from '../../assets/logo_light.png';

const pages = [
  {
    label: 'Partie du jour',
    url: '/today'
  },
];

const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [volume, setVolume] = useLocalStorage('player_volume', 70);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = page => {
    if (page.url) {
      navigate(page.url);
    }
    setAnchorElNav(null);
  };

  const onClickLogo = () => {
    navigate('/');
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <img src={logo} height="40px" style={{ marginRight: '24px', cursor: 'pointer' }} alt="BlindTus logo" onClick={() => onClickLogo()} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: page.color || 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}

          </Box>
          <div style={{ marginRight: '16px' }}>
            <PlayerVolume onChange={(event, newValue) => setVolume(newValue)} value={volume} />
          </div>
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => handleCloseNavMenu({ url: '/login'})}
              variant="outlined"
              sx={{ my: 2, display: 'block' }}
              color="success"
            >
              Se connecter
            </Button>
            <Button
              onClick={() => handleCloseNavMenu({ url: '/signup'})}
              variant="contained"
              sx={{ my: 2, display: 'block', marginLeft: '16px' }}
            >
              Créer un compte
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
