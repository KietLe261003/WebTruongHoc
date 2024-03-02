import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function NavItem(props) {
    const icon=props.icon;
    const title=props.title;
    const link =props.link;
    return (
        <Link to={link} class="text-blue-400 flex relative px-4 hover:bg-gray-700 cursor-pointer m-3">
            <div class="mr-4">
                <svg class="fill-current h-5 w-5" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <FontAwesomeIcon icon={icon}/>
                </svg>
            </div>
            <div class="flex-auto my-1">
                <span>{title}</span>
            </div>
        </Link>
    );
}

export default NavItem;