import React, { useContext, useEffect, useState } from 'react';
import {
  useNavigate,
  NavLink as RouterLink,
  useLocation,
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setCookie } from 'react-use-cookie';
import { useLocalStorage } from 'usehooks-ts';
import ReactMarkdown from 'react-markdown';

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
  Badge,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { isMobileDevice } from '../../lib/check';
import { UserContext } from '../../contexts/userContext';
import { notificationsActions } from '../../actions';
import { GameVolume } from '../Game';
import { getLevel } from '../../lib/levels';

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
    url: '/today',
    icon: <CalendarMonthIcon />,
  },
  {
    label: 'Multijoueur',
    url: '/lobby',
    icon: <GroupIcon />,
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
    id: 'suggest',
    label: 'Suggérer...',
    url: '/suggest',
    icon: <AddIcon />,
  },
];

const settingsMiddle = [
  {
    id: 'terms',
    label: 'Mentions légales',
    url: '/terms',
  },
  {
    id: 'privacy',
    label: 'Confidentialité',
    url: '/privacy',
  },
];

const settingsBottom = [
  {
    id: 'logout',
    label: 'Se déconnecter',
    url: '/login',
  },
];

function CircularProgressWithLabel({
  progress,
  label,
  labelSize = 14,
  ...props
}) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          sx={{ paddingTop: '4px' }}
          fontSize={labelSize}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

const ResponsiveAppBar = (props) => {
  const [isExpOpen, setExpOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [volume, setVolume] = useLocalStorage('player_volume', 70);
  const { user } = useContext(UserContext);
  const [levelInfo, updateLevelInfo] = useState(getLevel(user.exp));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    props.notificationsActions.getNotifications(user._id);
  }, [user, props.notificationsActions]);

  useEffect(() => {
    updateLevelInfo(getLevel(user.exp));
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting.id === 'logout') {
      setCookie('user', '', {
        days: 0,
        domain:
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? ''
            : '.blindtus.com',
      });
    }
    navigate(setting.url);
    setAnchorElUser(null);
  };

  const onClickLogo = () => {
    navigate('/');
  };

  if (!user) {
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
                  onClick={() => handleCloseNavMenu()}
                  className="Header__nav_mobile"
                >
                  <RouterLink
                    key={page.label}
                    to={page.url}
                    style={{
                      color:
                        location.pathname.indexOf(page.url) > -1
                          ? '#af79ff'
                          : 'white',
                    }}
                  >
                    {page.icon && page.icon}
                    {page.label}
                  </RouterLink>
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
                className="Header__nav_desktop"
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
            <div
              style={{
                display: 'inline-flex',
                verticalAlign: 'middle',
                cursor: 'pointer',
                marginRight: 8,
              }}
              onClick={() => setExpOpen(true)}
            >
              <CircularProgressWithLabel
                label={levelInfo.currentLevel}
                progress={levelInfo.progress}
              />
            </div>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenNotification}
              sx={{ mr: 2 }}
            >
              <Badge
                badgeContent={
                  props.notifications?.filter(
                    (n) => !n.users.includes(user._id)
                  ).length
                }
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorElNotification}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{ mt: '45px' }}
              open={Boolean(anchorElNotification)}
              onClose={handleCloseNotificationMenu}
            >
              {!props.notifications.length && (
                <div style={{ minWidth: '200px' }}>
                  <MenuItem
                    sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Typography noWrap>
                      Aucune nouvelles notifications
                    </Typography>
                  </MenuItem>
                </div>
              )}
              {props.notifications.map((notification) => {
                const isRead = notification.users.includes(user._id);
                return (
                  <div
                    key={notification._id}
                    style={{ width: '300px', opacity: isRead ? 0.4 : 1 }}
                  >
                    <MenuItem
                      divider
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        whiteSpace: 'initial',
                        cursor: 'default',
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{ fontWeight: 'bold' }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography>
                        <ReactMarkdown>{notification.content}</ReactMarkdown>
                      </Typography>
                      {!isRead && (
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={async () => {
                            await props.notificationsActions.markAsRead(
                              notification._id,
                              user._id
                            );

                            await props.notificationsActions.getNotifications(
                              user._id
                            );
                          }}
                        >
                          <CheckIcon />
                        </Button>
                      )}
                    </MenuItem>
                  </div>
                );
              })}
            </Menu>

            <Tooltip title="Utilisateur">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <Avatar
                  alt={user.username}
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
              <Divider sx={{ mt: '4px' }} />
              {settingsMiddle.map((setting) => (
                <MenuItem
                  key={setting.id}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
              <Divider sx={{ mt: '4px' }} />
              {settingsBottom.map((setting) => (
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

      <Dialog
        open={isExpOpen}
        onClose={() => {
          setExpOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Expériences</DialogTitle>
        <Divider />
        <DialogContent>
          <CircularProgressWithLabel
            label={levelInfo.currentLevel}
            labelSize={34}
            progress={levelInfo.progress}
            size={120}
          />
          <DialogContentText>
            Vous êtes niveau {levelInfo.currentLevel}
          </DialogContentText>
          <DialogContentText>
            Encore {levelInfo.nextNeeded - levelInfo.currentExp} points avant le
            prochain niveau ({levelInfo.progress}%).
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => setExpOpen(false)}
            autoFocus
            variant="contained"
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.me,
    notifications: state.notifications.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    notificationsActions: bindActionCreators(notificationsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveAppBar);
