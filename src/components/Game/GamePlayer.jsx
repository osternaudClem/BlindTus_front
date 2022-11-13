import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useReadLocalStorage } from 'usehooks-ts';
import { api } from '../../config';
import { Button } from '@mui/material';
const API = api[process.env.NODE_ENV];

function GamePlayer({
  audioName,
  timecode,
  canPlay,
  onLoading,
  showControl,
  isReady,
}) {
  const [bufferReady, setBufferReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef();
  const volume = useReadLocalStorage('player_volume');

  useEffect(() => {
    audioRef.current.volume = volume === null ? 0.7 : volume / 100;
  }, [volume]);

  useEffect(() => {
    if (onLoading) {
      loop();
    }
  });

  useEffect(() => {
    if (isReady) {
      setBufferReady(true);
      audioRef.current.play();
    } else {
      setBufferReady(false);
    }
  }, [isReady]);

  const handleFirstPlay = function (event) {
    setHasPlayed(true);
  };

  const loop = function () {
    if (bufferReady) {
      return;
    }

    const buffered = audioRef.current.buffered;
    let loaded = 0;

    if (buffered.length) {
      loaded = parseInt((100 * buffered.end(0)) / audioRef.current.duration);
    }

    onLoading(loaded >= 20 ? 100 : (loaded * 100) / 20);

    if (loaded < 20) {
      setTimeout(loop, 50);
    }
  };

  return (
    <div>
      {!hasPlayed && isReady && (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => audioRef.current.play()}
        >
          Pas de son ? Click ici
        </Button>
      )}
      <audio
        src={`${API}/audio/${audioName}.mp3#t=${timecode}`}
        loop
        // autoPlay
        controls={showControl}
        ref={audioRef}
        onCanPlayThrough={canPlay}
        onPlay={(event) => handleFirstPlay(event)}
      />
    </div>
  );
}

GamePlayer.propTypes = {
  audioName: PropTypes.string.isRequired,
  canPlay: PropTypes.func,
  isReady: PropTypes.bool,
  showControl: PropTypes.bool,
  timecode: PropTypes.number,
};

GamePlayer.defaultProps = {
  canPlay: () => {},
  isReady: true,
  showControl: false,
  timecode: 0,
};

export default GamePlayer;
