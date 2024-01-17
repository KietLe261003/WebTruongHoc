import React, { useEffect, useState } from 'react';

import './Home.css';
import Slider from '../../Components/Home/Slider';
import Course from '../../Components/Home/Course';
import IntroVideo from '../../Components/Home/IntroVideo';
import ListNews from '../../Components/Home/ListNews';
import Utilities from '../../Components/Home/Utilities';
function Home() {
    const [counter, setCounter] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(item => item >= 2 ? 0 : item + 1);
        }, 3000);

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [counter]);

    return (
        <div style={{ width: '100%' }}>
            {/* slider start */}
            <Slider></Slider>
            <div style={{marginBottom: '100px'}}></div>
            <Course title="Khóa học trả phí" SizeCard="4"/> 
            <div style={{marginBottom: '100px'}}></div>
            <Course title="Khóa học miễn phí" SizeCard="8"/>
            <div style={{marginBottom: '100px'}}></div>


            <Utilities></Utilities>
            <div style={{marginBottom: '30px'}}></div>
            <ListNews></ListNews>
            <IntroVideo></IntroVideo>
            
        </div>
    );
}
export default Home;

