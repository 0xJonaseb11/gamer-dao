import { HTMLAttributes } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { AnimateSharedLayout, motion } from 'framer-motion';

import { TabsContainer } from './styles';

export type TabsType = {
  id: string | number;
  label: string;
  link: string;
  count?: number;
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  tabs: TabsType[];
  noAnimation?: boolean;
}

function Tabs ({ tabs, noAnimation, ...rest }: Props) {
  const { pathname, hash } = useLocation();

  return (
    <TabsContainer {...rest}>
      <AnimateSharedLayout>
        {tabs.length && tabs.map(({ id, label, link, count }) => (
          <NavLink
            key={id}
            className="tab text-lg"
            activeClassName="active font-semibold"
            to={link}
            isActive={() => (pathname + hash).includes(link)}
          >
            <span className="tab-label">{label}</span>

            {(link === pathname || link === pathname + hash) && (
              <motion.div
                className="tab-active"
                layoutId={noAnimation ? undefined : 'underline'}
                transition={{ duration: 0.2 }}
              />
            )}

            {Number(count) > 0 && <span className="tab-count">{count}</span>}
          </NavLink>
        ))}
      </AnimateSharedLayout>
    </TabsContainer>
  );
}

export default Tabs;
