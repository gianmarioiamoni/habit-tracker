import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import HabitList from './components/habits/HabitList';
import HabitsDashbord from './components/habits/HabitsDasboard'; 
import ProtectedRoute from '../src/components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import MessageToast from './components/ui/MessageToast';
import Footer from './components/ui/Footer';

import { useMessage } from "./contexts/MessageContext"


function App(): JSX.Element {
  const { showToast, message } = useMessage();


  return (
    <>
      <div className="flex flex-col min-h-screen"> 
        <Router>
          {/* Navbar */}
          <Navbar />
          <div className="flex-grow">
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
              <Route
                path="/habits/dashboard"
                element={
                  <ProtectedRoute>
                    <HabitsDashbord />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      
      <Footer />

    </div >
    </>
  )
};

export default App;