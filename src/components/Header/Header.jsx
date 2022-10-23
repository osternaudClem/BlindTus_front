import React, { useContext, useEffect, useState } from 'react';
import {
  useNavigate,
  NavLink as RouterLink,
  useLocation,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { setCookie } from 'react-use-cookie';
import { useLocalStorage } from 'usehooks-ts';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { isMobileDevice } from '../../lib/check';
import { UserContext } from '../../contexts/userContext';
import { GameVolume } from '../Game';
import logo from '../../assets/logo_light.png';

import './Header.scss';

const pages = [
  {
    label: 'Démarer une partie',
    url: '/game',
    icon: <PlayArrowIcon />,
  },
  {
    label: 'Partie du jour',
    url: '/playtoday',
    icon: <CalendarMonthIcon />,
  },
  {
    label: 'Multijoueur',
    url: '/lobby',
    icon: <GroupIcon />,
  },
  {
    label: 'Suggérer un film',
    url: '/suggest-movie',
    icon: <AddIcon />,
  },
];

const settings = [
  {
    id: 'profile',
    label: 'Profile',
    url: '/settings',
  },
  {
    id: 'history',
    label: 'Historique',
    url: '/history',
  },
  {
    id: 'logout',
    label: 'Se déconnecter',
    url: '/login',
  },
];

const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [volume, setVolume] = useLocalStorage('player_volume', 70);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {}, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting.id === 'logout') {
      setCookie('user', '', {
        days: 0,
        domain:
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? ''
            : '.cl3tus.com',
      });
    }
    navigate(setting.url);
    setAnchorElUser(null);
  };

  const onClickLogo = () => {
    navigate('/');
  };

  if (!props.user) {
    return;
  }

  return (
    <AppBar
      position="sticky"
      className="Header"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
                <MenuItem
                  key={page.label}
                  onClick={() => handleCloseNavMenu(page)}
                >
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }}>
            <img
              src={logo}
              className="Header__logo"
              alt="BlindTus logo"
              onClick={() => onClickLogo()}
            />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={RouterLink}
                to={page.url}
                startIcon={page.icon && page.icon}
                sx={{
                  my: 2,
                  mr: '12px',
                  color:
                    location.pathname.indexOf(page.url) > -1
                      ? '#af79ff'
                      : 'white',
                }}
                size="small"
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Utilisateur">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <Avatar
                  alt={props.user.username}
                  src={user.avatar}
                  sx={{ width: 50, height: 50 }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!isMobileDevice() && (
                <div>
                  <div
                    style={{ flexGrow: 0, display: 'flex' }}
                    className="Header__volume-container"
                  >
                    <GameVolume
                      className="Header__volume"
                      onChange={(event, newValue) => setVolume(newValue)}
                      value={volume}
                    />
                  </div>
                  <Divider sx={{ mt: '4px' }} />
                </div>
              )}
              {settings.map((setting) => (
                <MenuItem
                  key={setting.id}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.me,
  };
}

export default connect(mapStateToProps, null)(ResponsiveAppBar);
