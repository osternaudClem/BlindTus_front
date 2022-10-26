import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './layouts/App';
import Connected from './layouts/Connected';
import NotConnected from './layouts/NotConnected';
import Other from './layouts/Other';
import { UserContext } from './contexts/userContext';

import {
  // Game
  NewGamePage,
  EndGamePage,
  // Multi
  MultiPage,
  // Today
  TodayPage,
  // User
  LoginPage,
  SignupPage,
  HistoryPage,
  ConfirmEmailPage,
  UserSettingsPage,
  SuggestPage,
  NewPasswordPage,
  AskNewPasswordPage,
  // Others
  HomePage,
  TestPage,
  PrivacyPage,
  TermsPage,
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
      fontSize: '4rem',
    },
    h2: {
      fontSize: '3.2rem',
    },
    h3: {
      fontSize: '2.6rem',
    },
  },
});

const RoutesUrl = () => {
  const [user, setUser] = useState({});

  const updateUser = function (user) {
    setUser(user);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<App />}
            >
              <Route
                path="/"
                element={<Connected />}
              >
                <Route
                  path=""
                  element={<HomePage />}
                />
                <Route
                  path="/game"
                  element={<NewGamePage />}
                />
                <Route
                  path="/game/end"
                  element={<EndGamePage />}
                />
                <Route
                  path="/history"
                  element={<HistoryPage />}
                />
                <Route
                  path="/settings"
                  element={<UserSettingsPage />}
                />
                <Route
                  path="/lobby"
                  element={<MultiPage />}
                />
                <Route
                  path="/suggest"
                  element={<SuggestPage />}
                />
                <Route
                  path="/test"
                  element={<TestPage />}
                />
              </Route>
              <Route
                path="/"
                element={<NotConnected />}
              >
                <Route
                  path="/login"
                  element={<LoginPage />}
                />
                <Route
                  path="/signup"
                  element={<SignupPage />}
                />
                <Route
                  path="/confirm"
                  element={<ConfirmEmailPage />}
                />
                <Route
                  path="/ask-new-password"
                  element={<AskNewPasswordPage />}
                />
                <Route
                  path="/new-password"
                  element={<NewPasswordPage />}
                />
              </Route>
              <Route
                path="/"
                element={<Other />}
              >
                <Route
                  path="/today"
                  element={<TodayPage />}
                />
                <Route
                  path="/privacy"
                  element={<PrivacyPage />}
                />
                <Route
                  path="/terms"
                  element={<TermsPage />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </UserContext.Provider>
  );
};
export default RoutesUrl;
