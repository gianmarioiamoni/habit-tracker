import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard'; 
import ProtectedRoute from '../src/components/auth/ProtectedRoute';
import Navbar from './components/Navbar';

// import logo from './logo.svg';
import './App.css';

// const App: React.FC = () => {
function App(): JSX.Element {
  const [showToast, setShowToast] = useState(false);

  return (
    <AuthProvider>
      <Router>
        {/* Navbar */}
        <Navbar setShowToast={setShowToast}/>
        {/* Toast message for successful logout */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            Logout successful!
          </div>
        )}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;