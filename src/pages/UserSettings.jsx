import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Container,
  CssBaseline,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { AvatarSettings, CredentialsSettings, ChangePasswordSettings } from '../components/Settings';
import { usersActions } from '../actions';

function UserSettings(props) {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlTab = searchParams.get('t');
    if (urlTab) {
      setTab(parseInt(urlTab));
    }
  }, [searchParams])

  const updateTab = function (value) {
    setTab(value);
    navigate(`/settings?t=${value}`);
  }

  return (
    <Container>
      <CssBaseline />
      <Typography variant="h1" component="h1" mb={4}>Parametres</Typography>
      <Tabs
        value={tab}
        onChange={(event, value) => updateTab(value)}
        TabIndicatorProps={{ sx: { display: 'none' } }}
        sx={{
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
        }}
      >
        <Tab label="Avatar" />
        <Tab label="Informations du compte" />
        <Tab label="Changer de mot de passe" />
      </Tabs>
      {renderTab()}
    </Container>
  )

  function renderTab() {
    switch (tab) {
      case 0:
        return <AvatarSettings />

      case 1:
        return <CredentialsSettings />

      case 2:
        return <ChangePasswordSettings />

      default:
        return <AvatarSettings />
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(UserSettings);