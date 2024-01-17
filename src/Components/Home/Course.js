import React from "react";
import Card from './Card.js';
import { Button } from "flowbite-react";
function Course(props) {
    const Title=props.title;
    const SizeCard=props.SizeCard;
    const CardList= Array.from({length: SizeCard});
    return (<div style={{ marginTop: SizeCard }}>
        <h1 className='titleNews' style={{marginTop: 20, marginBottom: 20}}>{Title}</h1>
        <section id="gallery">
            <div class="container">
                <div class="row" style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {
                        CardList.map((_,index) =>(
                            <Card></Card>
                        ))
                    }
                </div>
            </div>
            <div className='btnNews'>
                <Button color="blue">Xem thêm</Button>
            </div>
        </section>
    </div>);
}

export default Course;