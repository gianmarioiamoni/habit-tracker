import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

import 'react-toastify/dist/ReactToastify.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

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
      <GoogleOAuthProvider clientId="2142023295-7pjnv4n2p9086gm3983tavqs5cnnjpgt.apps.googleusercontent.com">
      <MessageProvider>
        <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          </QueryClientProvider>
        </ToastProvider>
        </MessageProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
  
);

