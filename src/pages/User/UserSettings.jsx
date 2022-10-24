import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, CssBaseline, Tab, Tabs, Typography } from '@mui/material';

import {
  AvatarSettings,
  CredentialsSettings,
  ChangePasswordSettings,
} from '../../components/Settings';
import { usersActions } from '../../actions';
import { updateTitle } from '../../lib/document';
import { Heading } from '../../components/UI';

function UserSettings(props) {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    updateTitle('Paramètre du compte');
  }, []);

  useEffect(() => {
    const urlTab = searchParams.get('t');
    if (urlTab) {
      setTab(parseInt(urlTab));
    }
  }, [searchParams]);

  const updateTab = function (value) {
    setTab(value);
    navigate(`/settings?t=${value}`);
  };

  return (
    <Container>
      <CssBaseline />
      <Heading>Parametres</Heading>
      <Tabs
        value={tab}
        onChange={(event, value) => updateTab(value)}
        TabIndicatorProps={{ sx: { display: 'none' } }}
        sx={{
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
          mb: '16px',
        }}
      >
        <Tab label="Avatar" />
        <Tab label="Informations du compte" />
        <Tab label="Changer de mot de passe" />
      </Tabs>
      {renderTab()}
    </Container>
  );

  function renderTab() {
    switch (tab) {
      case 0:
        return <AvatarSettings />;

      case 1:
        return <CredentialsSettings />;

      case 2:
        return <ChangePasswordSettings />;

      default:
        return <AvatarSettings />;
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(UserSettings);
