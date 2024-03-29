import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCookie } from 'react-use-cookie';
import { todayActions, historyTodayActions } from '../../actions';
import { UserContext } from '../../contexts/userContext';
import { Today } from './';
import { Loading } from '../UI';

function TodayLogged(props) {
  const { user, updateUser } = useContext(UserContext);
  const userId = getCookie('user');

  useEffect(() => {
    (async function () {
      let today = props.today.game;

      if (!today) {
        today = await props.todayActions.getMusic();
      }

      if (!props.historyToday.today || !props.historyToday.today._id) {
        const game = await props.historyTodayActions.getTodayUser(userId);

        if (!game && today._id && userId) {
          await props.historyTodayActions.saveHistory({
            today: today._id,
            user: userId,
          });
        }
      }
    })();
  }, [
    props.today,
    props.historyToday.today,
    userId,
    props.historyTodayActions,
    props.todayActions,
  ]);

  const saveHistory = async function (answer, isCorrect) {
    const attempts =
      props.historyToday.today && props.historyToday.today.attempts
        ? JSON.parse(JSON.stringify(props.historyToday.today.attempts))
        : [];
    attempts.push(answer);

    props.historyTodayActions
      .saveHistory({
        ...props.historyToday.today,
        today: props.today.game._id,
        user: user._id,
        attempts,
        isWin: isCorrect,
        isCompleted:
          isCorrect ||
          (props.historyToday.today &&
            props.historyToday.today.attempts.length === 4),
      })
      .then((data) => {
        updateUser(data);
      });
  };

  if (
    !props.today.game ||
    !props.historyToday.today ||
    !props.historyToday.today._id
  ) {
    return <Loading />;
  }

  return (
    <Today
      onSaveHistory={saveHistory}
      game={props.today.game}
      history={props.historyToday.today}
    />
  );
}

function mapStateToProps(state) {
  return {
    today: state.today,
    historyToday: state.historyToday,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    todayActions: bindActionCreators(todayActions, dispatch),
    historyTodayActions: bindActionCreators(historyTodayActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodayLogged);
