import React from "react";
import Card from './Card'
function ListNews() {
    const List = Array.from({length: 8});
    return (<div style={{ }}>
        <div style={{display: "flex",flexDirection: "row",width: '100%', marginBottom: 10}}>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: "black" }}>Các bài viết</p>
            <p style={{marginLeft: 'auto',fontSize: '1.2rem', fontWeight: 600, color: "black"}}>Xem tất cả</p>
        </div>
        <section id="gallery">
            <div class="container">
                <div class="row" style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {
                        List.map((index) => (
                            <Card></Card>
                        ))
                    }
                </div>
            </div>
            
        </section>
    </div>);
}

export default ListNews;