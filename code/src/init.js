import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from '../../frontend/src/store/index';
import i18n from '../../frontend/src/i18n';
import App from '../../frontend/src/App';
import '../../frontend/src/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const init = (socket) => {
  const container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );

  return {
    container,
    root,
    cleanup: () => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
    getContainer: () => container,
  };
};

export default init;