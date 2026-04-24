import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppProviders from './app/providers/AppProviders.jsx';
import AppRoutes from './app/router/Routes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </StrictMode>
);