import ReactPlayer from 'react-player';

function Player({ url }) {
  return (
    <ReactPlayer
      url={url}
      playing={true}
      playsinline={true}
      loop={true}
      style={{
        position: 'fixed',
        top: '-1000px',
        left: '-1000px'
      }}
    />
  );
}

export default Player;