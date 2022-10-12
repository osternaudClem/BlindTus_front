import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCookie } from 'react-use-cookie';

import {
  todayActions,
  historyTodayActions,
} from '../actions';

import { UserContext } from '../contexts/userContext';

import { Today } from '../components/Today';

function GameOfTheDay(props) {
  const { user } = useContext(UserContext);
  const userId = getCookie('user');

  useEffect(() => {
    (async function () {
      if (!props.today.game) {
        await props.todayActions.getMusic();
      }

      if (!props.historyToday.today._id) {
        const game = await props.historyTodayActions.getTodayUser(userId);

        if (!game) {
          await props.historyTodayActions.saveHistory({
            today: props.today.game._id,
            user: userId,
          });
        }
      }
    })();
  }, [props.today.game, props.historyToday.today, userId, props.historyTodayActions, props.todayActions]);

  const saveHistory = async function (answer, isCorrect) {
    const attempts = props.historyToday.today && props.historyToday.today.attempts ? JSON.parse(JSON.stringify(props.historyToday.today.attempts)) : [];
    attempts.push(answer);

    props.historyTodayActions.saveHistory({
      ...props.historyToday.today,
      today: props.today.game._id,
      user: user._id,
      attempts,
      isWin: isCorrect,
      isCompleted: isCorrect || (props.historyToday.today && props.historyToday.today.attempts.length === 4),
    });
  }

  if (!props.today.game || !props.historyToday.today || !props.historyToday.today._id) {
    return <div>Chargement...</div>
  }

  return (
    <Today
      onSaveHistory={saveHistory}
      game={props.today.game}
      history={props.historyToday.today}
    />
  )
}

function mapStateToProps(state) {
  return {
    today: state.today,
    historyToday: state.historyToday,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    todayActions: bindActionCreators(todayActions, dispatch),
    historyTodayActions: bindActionCreators(historyTodayActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOfTheDay)