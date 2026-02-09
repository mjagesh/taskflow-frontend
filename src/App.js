import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/projects"
        element={
          <ProtectedRoute>
              <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:projectId"
        element={
          <ProtectedRoute>
             <Tasks />
          </ProtectedRoute>
        }
      />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
