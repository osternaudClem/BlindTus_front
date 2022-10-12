import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCountdown } from 'usehooks-ts';
import sonar from "../../assets/sounds/sonar.mp3";
import './Timer.scss';

function TimerFullscreen({ onFinished, limit }) {
  const [count, { startCountdown }] =
    useCountdown({
      countStart: limit,
      intervalMs: 1000,
    });

  const audio = new Audio(sonar);

  useEffect(() => {
    if (count === 0) {
      onFinished();
    }
    else {
      startCountdown();
      audio.play();
    }
  });


  return (
    <div className="TimerFullscreen">
      <div className="TimerFullscreen__timer">
        {count}
      </div>
    </div>
  )
}

TimerFullscreen.propTypes = {
  limit: PropTypes.number,
  onFinished: PropTypes.func,
};

TimerFullscreen.defaultProps = {
  limit: 3,
  onFinished: () => {},
};

export default TimerFullscreen;