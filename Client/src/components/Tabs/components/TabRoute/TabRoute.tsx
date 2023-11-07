import { ReactElement } from 'react';
import { Route } from 'react-router';

import { motion } from 'framer-motion';
// TODO: add proper animation
const tabsVariants = {
  initial: {
    opacity: 0,
    height: '200vh',
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0,
    height: 'auto',
  },
  exit: {
    opacity: 0,
    height: '200vh',
    y: 30
  },
};

interface Props {
  exact: boolean;
  children: ReactElement;
  path: string;
}

const TabRoute = ({ children, exact, path }: Props) => (
  <Route exact={exact} path={path}>
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={tabsVariants}
      transition={{ type: 'easeInOut', duration: 0.15 }}
    >
      {children}
    </motion.div>
  </Route>
);

export default TabRoute;
