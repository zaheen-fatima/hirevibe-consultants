import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { QueryProvider } from './app/QueryProvider';
import { AppThemeProvider } from './theme/ThemeProvider';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root was not found.');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
