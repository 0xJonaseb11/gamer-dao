import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StyleProvider } from '@q-dev/q-ui-kit';
import LanguageProvider from 'context/LanguageProvider';
import Web3ContextProvider from 'context/Web3ContextProvider';
import DaoInitializer from 'components/DaoInitializer';
import Layout from 'components/Layout';
import NotificationManager from 'components/NotificationManager';
import Routes from 'navigation/Routes';
import { store } from './store';
import '@mdi/font/css/materialdesignicons.min.css';

ReactDOM.render(
  <Provider store={store}>
    <StyleProvider>
      <LanguageProvider>
        <Web3ContextProvider>
          <BrowserRouter>
            <DaoInitializer>
              <Layout>
                <Routes />
              </Layout>
            </DaoInitializer>
          </BrowserRouter>
        </Web3ContextProvider>
        <NotificationManager />
      </LanguageProvider>
    </StyleProvider>
  </Provider>,
  document.getElementById('root')
);
