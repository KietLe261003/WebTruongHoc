import React, { useEffect, useState } from 'react';

import './Home.css';
import Slider from '../../Components/Home/Slider';
import Course from '../../Components/Home/Course';
import IntroVideo from '../../Components/Home/IntroVideo';
import ListNews from '../../Components/Home/ListNews';
import Utilities from '../../Components/Home/Utilities';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
function Home() {
    const [counter, setCounter] = useState(1);
    const [course,setCourese]=useState([]);
    const [courseFree,setCourseFree]=useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(item => item >= 2 ? 0 : item + 1);
        }, 3000);
        const getCourse = async () => {
            const q=query(collection(db,"course"),where("type","==","1"),limit(4));
            
            const docCourse = await getDocs(q);
            const dt=[];
            docCourse.forEach((item)=>{
                if(item.data().isPublic===true)
                dt.push(item.data());
            });
            setCourese(dt);
        }   
        const getCourseFree=async ()=>{
            const q=query(collection(db,"course"),where("type","==","0"),limit(8));
            const docCourseFree= await getDocs(q);
            const dt=[];
            docCourseFree.forEach((item)=>{
                if(item.data().isPublic===true)
                dt.push(item.data());
            });
            //console.log(dt);
            setCourseFree(dt);
        } 
        // Clear the interval when the component unmounts
        return () => {
            getCourseFree();
            getCourse();
            clearInterval(interval);
        }
    }, [counter]);

    return (
        <div style={{ width: '100%' }}>
            {/* slider start */}
            <Slider></Slider>
            <div style={{marginBottom: '100px'}}></div>
            {
                course.length > 0 && <Course title="Khóa học trả phí" course={course} SizeCard="4"/> 
            }
            <div style={{marginBottom: '100px'}}></div>
            {
                courseFree.length >0 && <Course title="Khóa học miễn phí" course={courseFree} SizeCard="8"/>
            }
            <div style={{marginBottom: '100px'}}></div>


            <Utilities></Utilities>
            <div style={{marginBottom: '30px'}}></div>
            <ListNews></ListNews>
            <IntroVideo></IntroVideo>
            
        </div>
    );
}
export default Home;

