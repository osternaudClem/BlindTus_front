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
  TodayPage,
  UserSettingsPage,
  MultiPage,
  SuggestMoviePage,
  NewPasswordPage,
  AskNewPasswordPage,
} from './pages';
import { CssBaseline } from '@mui/material';

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
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<HomePage />} />
          <Route path="/new-game" element={<NewGamePage />} />
          <Route path="/end-game" element={<EndGamePage />} />
          <Route path="/playtoday" element={<GameOfTheDayPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/lobby" element={<MultiPage />} />
          <Route path="/suggest-movie" element={<SuggestMoviePage />} />
          <Route path="/suggest-movie/:movie_query" element={<SuggestMoviePage />} />
          <Route path="/suggest-movie/:movie_query/:movie_id" element={<SuggestMoviePage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>
        <Route path="/" element={<NotConnected />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirm" element={<ConfirmEmailPage />} />
          <Route path="/ask-new-password" element={<AskNewPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/today" element={<TodayPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default RoutesUrl;