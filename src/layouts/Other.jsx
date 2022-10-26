import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material/';

import '../assets/App.scss';

function Other(props) {
  return (
    <Container
      maxWidth="xl"
      className="Page"
    >
      <Outlet />
    </Container>
  );
}

export default Other;
