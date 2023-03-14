import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/userContext';
import { updateTitle } from '../../lib/document';
import {
  TodayLoggedContainer,
  TodayNotLoggedContainer,
} from '../../components/Today';

function Today() {
  const { isLogged } = useContext(UserContext);

  useEffect(() => {
    updateTitle('Partie du jour');
  }, []);

  return isLogged ? <TodayLoggedContainer /> : <TodayNotLoggedContainer />;
}

export default Today;
