import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from '../../frontend/src/store';
import i18n from '../../frontend/src/i18n';
import App from '../../frontend/src/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../frontend/src/App.css';

const init = (socket) => {
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