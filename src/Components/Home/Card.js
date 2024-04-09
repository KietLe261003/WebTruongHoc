
'use client';
import React from 'react';
import { Card } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

function Component(props) {
  const course=props.course;
  console.log(course);
  const navigate= useNavigate();
  return (
    course && 
    <Card 
      className="max-w-sm p-0"
      renderImage={() => <img width={400} height={400} style={{maxHeight: 200}} src={course.photoURL} alt=""/>}
      style={{maxWidth: 350, margin: 5, height: 400}}
    >
      <button onClick={()=>{navigate(`/Course/Detail/${course.id}`)}}>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {course.nameCourse}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {course.description}
        </p>
      </button>
    </Card>
  );
}
export default Component;