import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { WalletProviderWrapper } from './contexts/WalletContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProviderWrapper>
        <App />
      </WalletProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
