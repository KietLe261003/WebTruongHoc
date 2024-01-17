import React from 'react';
import './Course_Outline.css';
import CardCourseOutline from './CardCourseOutline';
function CourseOutline() {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <CardCourseOutline></CardCourseOutline>
            <CardCourseOutline></CardCourseOutline>
            <CardCourseOutline></CardCourseOutline>
            <CardCourseOutline></CardCourseOutline>
            <CardCourseOutline></CardCourseOutline>
        </div>
    );
}

export default CourseOutline;