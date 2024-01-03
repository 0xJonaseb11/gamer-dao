import { FC, ReactElement } from 'react';
import { Switch } from 'react-router';

import { AnimatePresence } from 'framer-motion';

const TabSwitch: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      <Switch>
        {children}
      </Switch>
    </AnimatePresence>
  );
};

export default TabSwitch;
