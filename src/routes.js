import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './layouts/App';
import NotConnected from './layouts/NotConnected';

import {
  HomePage,
  NewGamePage,
  EndGamePage,
  TestPage,
  LoginPage,
  SignupPage,
  HistoryPage,
  ConfirmEmailPage,
  GameOfTheDayPage,
  LobbyPage,
  PlayPage,
  ResultsPage,
  UserSettingsPage,
} from './pages';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#784af4',
    },
    secondary: {
      main: '#af79ff',
    },
  },
  typography: {
    h1: {
      fontSize: '4rem'
    },
    h2: {
      fontSize: '3.2rem'
    },
    h3: {
      fontSize: '2.6rem'
    }
  }
});

const RoutesUrl = () => (
  <ThemeProvider theme={darkTheme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<HomePage />} />
          <Route path="/new-game" element={<NewGamePage />} />
          <Route path="/end-game" element={<EndGamePage />} />
          <Route path="/today" element={<GameOfTheDayPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/multi/results" element={<ResultsPage />} />
        </Route>
        <Route path="/" element={<NotConnected />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirm" element={<ConfirmEmailPage />} />
        </Route>
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default RoutesUrl;