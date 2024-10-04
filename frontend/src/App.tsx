import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import HabitList from './components/habits/HabitList'; 
import ProtectedRoute from '../src/components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import MessageToast from './components/utils/MessageToast';

import { useMessage } from "./contexts/MessageContext"

// import logo from './logo.svg';
import './App.css';

function App(): JSX.Element {
  const { showToast, message } = useMessage();


  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      {/* Message Area */}
      <MessageToast message={message} showToast={showToast} />

      {/* Routes */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HabitList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;