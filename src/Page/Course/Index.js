import React from 'react';
import './Course.css';
import { Outlet } from 'react-router-dom';
function Course() {
    
    return (
        <div>
            <Outlet/>
        </div>
    );
}
export default Course;