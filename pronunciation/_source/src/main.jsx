import React from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsProvider } from './lib/settings';
import App from './App';
import './styles/brand.css';
import './styles/app.css';
import './styles/mouth.css';
import './styles/print.css';

createRoot(document.getElementById('root')).render(
  <SettingsProvider><App /></SettingsProvider>
);
