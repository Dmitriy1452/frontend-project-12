import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from './store';
import i18n from './i18n';
import App from './App';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const init = async (socket) => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

export default init;