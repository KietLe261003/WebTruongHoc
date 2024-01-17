import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import Layout from './Components/Layout/Layout/Layout';
import Login from './Page/Login/Index.js';
import Home from './Page/Home/Index.js';
import Course from './Page/Course/Index.js';
import CourseOutline from './Page/Course_Outline/Index.js';
import Group from './Page/Group/Index.js';
import Class from './Page/Class/Index.js';
import Blog from './Page/Blog/Index.js';
import Profile from './Page/Profile/Index.js';
function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<Layout/>}>
              <Route path='/Home' element={<Home/>}/>
              <Route path='/CourseOutline' element={<CourseOutline/>}/>
              <Route path='/Course' element={<Course/>}/>
              <Route path='/Group' element={<Group/>}/>
              <Route path='/Class' element={<Class/>}/>
              <Route path='/Blog' element={<Blog/>}/>
              <Route path='/Profile' element={<Profile/>}/>
            </Route>
            <Route path='/Login' element={<Login/>}/>
        </Routes>
    </div>
  );
}

export default App;
