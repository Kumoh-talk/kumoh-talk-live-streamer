import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
      <ToastContainer
        position="bottom-left"
        limit={5}
        closeButton={false}
        autoClose={3000}
        hideProgressBar
      />
    </CookiesProvider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
