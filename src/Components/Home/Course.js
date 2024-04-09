import React from "react";
import Card from './Card.js';
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
function Course(props) {
    const Title=props.title;
    const SizeCard=props.SizeCard;
    const CardList= props.course;
    const navigate= useNavigate();
    return (
        <div style={{ marginTop: SizeCard }}>
            <h1 className='titleNews' style={{ marginTop: 20, marginBottom: 20 }}>{Title}</h1>
            <section id="gallery">
                <div class="container">
                    <div class="row" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {
                            CardList.map((item,index) => (
                                <Card key={index} course={item}></Card>
                            ))
                        }
                    </div>
                </div>
                <div className='btnNews'>
                    <Button color="blue" onClick={()=>{navigate("/Course")}}>Xem thêm</Button>
                </div>
            </section>
        </div>
    );
}

export default Course;