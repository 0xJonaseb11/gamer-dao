import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import logo from 'assets/img/logo.png';
import Network from 'navigation/Header/components/Network';

import packageJson from '../../../package.json';

import SidebarLink from './components/SidebarLink/SidebarLink';
import VersionModal from './components/VersionModal';
import { SidebarContainer } from './styles';

import { useDaoStore } from 'store/dao/hooks';

import { RoutePaths } from 'constants/routes';

function Sidebar ({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { composeDaoLink, isShowDao } = useDaoStore();
  const [versionModalOpen, setVersionModalOpen] = useState(false);

  return (
    <SidebarContainer $open={open} isSelectPage={isShowDao}>
      <div className="sidebar-overlay" onClick={onClose} />

      <div className="sidebar" onClick={onClose}>
        <div className="sidebar-content">
          <Link
            to="/"
            className="sidebar-logo-link"
          >
            <img
              className="sidebar-logo"
              alt="Q Logo"
              src={logo}
            />
            <p className="sidebar__logo-title text-h2">
              {t('DAO_DASHBOARD')}
            </p>
          </Link>

          <div className="sidebar-main">
            <div className="sidebar__network">
              <Network />
            </div>
            {!isShowDao && <div className="sidebar-links">
              <SidebarLink
                exact={!pathname.includes('dashboard')}
                to={composeDaoLink('/')}
                title={t('DASHBOARD')}
                icon="dashboard"
              />

              <SidebarLink
                exact={false}
                to={composeDaoLink(RoutePaths.votingPower)}
                title={t('VOTING_POWER')}
                icon="bank"
              />

              <SidebarLink
                exact={false}
                to={composeDaoLink('/governance')}
                title={t('GOVERNANCE')}
                icon="vote"
              />
            </div>}

           
          </div>
        </div>

        

        <VersionModal open={versionModalOpen} onClose={() => setVersionModalOpen(false)} />
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;
