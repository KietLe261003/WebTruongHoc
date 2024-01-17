import React, { useEffect, useState } from 'react';
import Image from './Image';
function Slider() {
    const [counter, setCounter] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(item => item >= 2 ? 0 : item + 1);
        }, 3000);

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [counter]);
    return (<div id="carouselExampleControls" class="carousel slide" data-ride="carousel" >
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="d-block w-100" src={Image[counter]} alt="First slide" style={{ height: '400px' }} />
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>);
}

export default Slider;