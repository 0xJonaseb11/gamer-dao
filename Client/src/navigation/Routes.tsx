import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import LazyLoading from 'components/Base/LazyLoading';
import ErrorBoundary from 'components/Custom/ErrorBoundary';

const SelectDAO = lazy(() => import('pages/SelectDAO'));
const Imprint = lazy(() => import('pages/Imprint'));
const DataPrivacy = lazy(() => import('pages/DataPrivacy'));
const NotFound = lazy(() => import('pages/NotFound'));

const VotingPower = lazy(() => import('pages/VotingPower'));
const Manage = lazy(() => import('pages/Parameters'));
const Dashboard = lazy(() => import('pages/Dashboard'));

const Governance = lazy(() => import('pages/Governance'));
const NewProposal = lazy(() => import('pages/Governance/NewProposal'));
const Proposal = lazy(() => import('pages/Governance/Proposal'));

function Routes () {
  return (
    <ErrorBoundary>
      <LazyLoading>
        <Switch>
          <Route exact path="/">
            <SelectDAO />
          </Route>

          <Route exact path="/imprint">
            <Imprint />
          </Route>

          <Route exact path="/privacy">
            <DataPrivacy />
          </Route>

          <Route exact path="/:address">
            <Dashboard />
          </Route>

          <Route exact path="/:address/parameters/:type?">
            <Manage />
          </Route>

          <Route exact path="/:address/governance/:type/new">
            <NewProposal />
          </Route>

          <Route exact path="/:address/governance/:tab?">
            <Governance />
          </Route>

          <Route exact path="/:address/governance/proposal/:panel?/:id?">
            <Proposal />
          </Route>

          <Route exact path="/:address/voting-power">
            <VotingPower />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </LazyLoading>
    </ErrorBoundary>
  );
}

export default Routes;
