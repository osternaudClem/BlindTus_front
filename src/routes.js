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
          <Route path="/test" element={<TestPage />} />
        </Route>
        <Route path="/" element={<NotConnected />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirm" element={<ConfirmEmailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default RoutesUrl;