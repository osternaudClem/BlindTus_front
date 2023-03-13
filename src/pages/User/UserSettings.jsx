import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, CssBaseline, Tab, Tabs } from '@mui/material';

import {
  CredentialsSettingsContainer,
  ChangePasswordSettingsContainer,
  AvatarSettingsContainer,
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
      case 1:
        return <CredentialsSettingsContainer />;

      case 2:
        return <ChangePasswordSettingsContainer />;

      case 0:
      default:
        return <AvatarSettingsContainer />;
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(UserSettings);
