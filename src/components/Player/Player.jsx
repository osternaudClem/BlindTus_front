import ReactPlayer from 'react-player';
import { useReadLocalStorage } from 'usehooks-ts';

function Player({ url }) {
  const volume = useReadLocalStorage('player_volume')

  return (
    <ReactPlayer
      url={url}
      playing={true}
      playsinline={true}
      loop={true}
      volume={volume === null ? .7 : volume / 100}
      style={{
        position: 'fixed',
        top: '-1000px',
        left: '-1000px'
      }}
    />
  );
}

export default Player;