import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <MessageProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MessageProvider>
    </AuthProvider>
  </React.StrictMode>
  
);

