import React from "react";
function IntroVideo() {
    return (<div className='IntroVideo' style={{ marginTop: 50 }}>
        <h1 className='titleNews'>Học lập trình</h1>
        <br/>
        <section id="gallery">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 mb-3">
                        <div class="card">
                            <iframe width="360" height="200" src="https://www.youtube.com/embed/cP7JA8jYhSE?si=EbBsOI55dIrHen76" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                    </div>
                    <div class="col-lg-3 mb-3">
                        <div class="card">
                            <iframe width="360" height="200" src="https://www.youtube.com/embed/DpvYHLUiZpc?si=F6szl6H13zDexzwl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                    </div>
                    <div class="col-lg-3 mb-3">
                        <div class="card">
                            <iframe width="360" height="200" src="https://www.youtube.com/embed/Q2YQbOV2ZNU?si=tzxL9Epp4ahjeFQL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                    </div>
                    <div class="col-lg-3 mb-3">
                        <div class="card">
                            <iframe width="360" height="200" src="https://www.youtube.com/embed/QK7t5Aodgik?si=BXSJ8oy7wcL95zwr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>);
}

export default IntroVideo;