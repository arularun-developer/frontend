import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../pages/Dashboard';
import Piechart from '../pages/Piechart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Login/>} />
        <Route path="/register" element={< Register/>} />
        <Route path="/Dashboard" element={< Dashboard/>} />
        <Route path="/piechart" element={< Piechart/>} />


      </Routes>
    </Router>

  );
}

export default App;
