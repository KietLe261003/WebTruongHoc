import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons'

function ListIcon() {
    return (
        <div class="d-flex justify-content-center text-center mt-4 pt-1">
            <a href="#!" class="text-white"><FontAwesomeIcon style={{ width: 25, height: 25 }} className="icon" icon={faFacebook} /></a>
            <a href="#!" class="text-white"><FontAwesomeIcon style={{ width: 25, height: 25 }} className="icon" icon={faTwitter} /></a>
            <a href="#!" class="text-white"><FontAwesomeIcon style={{ width: 25, height: 25 }} className="icon" icon={faGoogle} /></a>
        </div>
    );
}

export default ListIcon;