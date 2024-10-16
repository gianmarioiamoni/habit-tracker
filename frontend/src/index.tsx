import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';
import { ToastProvider } from './contexts/ToastContext';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <MessageProvider>
        <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          </QueryClientProvider>
        </ToastProvider>
      </MessageProvider>
    </AuthProvider>
  </React.StrictMode>
  
);

