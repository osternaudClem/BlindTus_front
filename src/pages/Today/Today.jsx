import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/userContext';
import { updateTitle } from '../../lib/document';
import { TodayLogged, TodayNotLogged } from '../../components/Today';

function Today() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    updateTitle('Partie du jour');
  }, []);

  return user._id ? <TodayLogged /> : <TodayNotLogged />;
}

export default Today;
