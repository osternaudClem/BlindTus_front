import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactGA from 'react-ga';
import { CssBaseline } from '@mui/material';
import { getCookie } from 'react-use-cookie';
import {
  CookieConsentBanner,
  triggerCookieConsentBanner,
} from '@porscheofficial/cookie-consent-banner-react';
import { usersActions } from '../actions';
import { Header, HeaderNotLogged } from '../components/Header';
import { Loading } from '../components/UI';
import { UserContext } from '../contexts/userContext';

import '../assets/App.scss';

function App(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [displayCookieConstent, setDisplayCookieConsent] = useState(true);
  const navigate = useNavigate();
  const userId = getCookie('user');
  const acceptedCookies = getCookie('cookies_accepted_categories');
  const gat = getCookie('_gat');
  const ga = getCookie('_ga');
  const gid = getCookie('_gid');

  useEffect(() => {
    if (userId && userId !== '') {
      (async function () {
        if (!props.users.me.username || !user._id) {
          const userLoaded = await props.usersActions.getUserById(userId);
          setUser(userLoaded);
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }

    if (acceptedCookies && acceptedCookies.includes('analytics')) {
      if (!gat || !ga | !gid) {
        ReactGA.initialize(process.env.REACT_APP_API_TOKEN);
        ReactGA.pageview(window.location.pathname + window.location.search);
      }
    }
  }, [
    navigate,
    props.users.me.username,
    props.usersActions,
    user,
    userId,
    acceptedCookies,
    gat,
    ga,
    gid,
  ]);

  const initConsent = ({ acceptedCategories }) => {
    setDisplayCookieConsent(false);
    if (acceptedCategories.includes('analytics')) {
      ReactGA.initialize(process.env.REACT_APP_API_TOKEN);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  };

  const updateUser = function (user) {
    setUser(user);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <div className={displayCookieConstent ? 'overlay-cookie' : ''}>
        <CssBaseline />
        {userId ? <Header user={user} /> : <HeaderNotLogged />}
        <Outlet />
        <CookieConsentBanner
          className="CookieConsentBanner"
          headline="Politique concernant les cookies"
          handlePreferencesUpdated={initConsent}
          handlePreferencesRestored={initConsent}
          btnLabelAcceptAndContinue="Accepter et continuer"
          btnLabelSelectAllAndContinue="Tous selectionner et continuer"
          btnLabelOnlyEssentialAndContinue="Accepter le minimum et continuer"
          btnLabelPersistSelectionAndContinue="Enregistrer la selection et continuer"
          contentSettingsDescription="Vous pouvez décider quels cookies sont utilisés en sélectionnant les options respectives ci-dessous. Veuillez noter que votre sélection peut nuire à la fonctionnalité du service."
          availableCategories={[
            {
              description:
                "Permettent de naviguer et d'utiliser les fonctions de base et de mémoriser les préférences.",
              key: 'technically_required',
              label: 'Cookie techniques necessaire',
              isMandatory: true,
            },
            {
              description:
                "Nous permettre de déterminer comment les visiteurs interagissent avec notre service afin d'améliorer l'expérience utilisateur.",
              key: 'analytics',
              label: 'Cookies analytics (Google)',
            },
          ]}
        >
          Nous utilisons des cookies et des technologies similaires pour fournir
          certaines fonctionnalités et améliorer l'expérience utilisateur. Selon
          leur finalité, les cookies d'analyse peuvent être utilisés en plus des
          cookies techniquement nécessaires. En cliquant sur "Accepter et
          continuer", vous déclarez votre consentement à l'utilisation de la
          cookies susmentionnés.
          <button
            onClick={() => {
              triggerCookieConsentBanner({ showDetails: true });
            }}
            onKeyPress={() => {
              triggerCookieConsentBanner({ showDetails: true });
            }}
            type="button"
          >
            Ici
          </button>{' '}
          vous pouvez effectuer des réglages détaillés ou révoquer votre
          consentement (en partie si nécessaire). Pour plus d'informations,
          veuillez allez sur la page <Link to="/privacy">Confidentialité</Link>.
        </CookieConsentBanner>
      </div>
    </UserContext.Provider>
  );
}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
