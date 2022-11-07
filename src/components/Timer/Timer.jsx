import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './Timer.scss';

const Timer = ({ limit, onFinished, className }) => {
  const [timeLeft, setTimeLeft] = useState(limit * 10);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(function () {
        onFinished(0);
        setTimeLeft(limit * 10);
      }, 100);
    }

    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
      createProgress(timeLeft);
      onFinished(timeLeft);
    }, 100);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return (
    <div className={classnames('Timer', className)}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            classes={{ root: 'Timer__bar' }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {Math.round(timeLeft / 10)}
          </Typography>
        </Box>
      </Box>
    </div>
  );

  function createProgress(timeLeft) {
    if (timeLeft === 0) {
      setProgress(100);
    } else {
      const pourcentage = 100 - ((timeLeft - 1) * 10) / limit;
      setProgress(pourcentage);
    }
  }
};

export default Timer;
