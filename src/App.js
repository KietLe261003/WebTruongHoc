import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './Components/Layout/Header/Header';
import Login from './Components/View/Login/Login';

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<Header/>}/>
            <Route path='/Login' element={<Login/>}/>
        </Routes>
    </div>
  );
}

export default App;
