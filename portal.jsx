/* eslint-disable */
/**
 * Portal master — wires Landing + Dashboard into a single SPA.
 * Sets window.__PORTAL_ROUTER so child apps' "Войти в ЛК" and "На сайт"
 * buttons switch view in-app instead of navigating to other HTML files.
 */
const PortalApp = () => {
  const [view, setView] = React.useState(
    window.location.hash === '#cabinet' ? 'dashboard' : 'landing'
  );

  React.useEffect(() => {
    window.__PORTAL_ROUTER = {
      goLanding: () => {
        window.location.hash = '';
        setView('landing');
        window.scrollTo({ top: 0, behavior: 'instant' });
      },
      goDashboard: () => {
        window.location.hash = 'cabinet';
        setView('dashboard');
        window.scrollTo({ top: 0, behavior: 'instant' });
      },
    };
    const onHash = () => {
      setView(window.location.hash === '#cabinet' ? 'dashboard' : 'landing');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Both apps mount once, hidden via display:none so per-app state
  // (theme, role, page, form drafts) survives the switch.
  return (
    <>
      <div style={{ display: view === 'landing' ? 'block' : 'none' }}>
        <window.LandingApp />
      </div>
      <div style={{ display: view === 'dashboard' ? 'block' : 'none' }}>
        <window.DashboardApp />
      </div>
    </>
  );
};

window.__PORTAL_ROUTER = window.__PORTAL_ROUTER || {
  goLanding: () => {},
  goDashboard: () => {},
};

const portalRoot = ReactDOM.createRoot(document.getElementById('root'));
portalRoot.render(<PortalApp />);
