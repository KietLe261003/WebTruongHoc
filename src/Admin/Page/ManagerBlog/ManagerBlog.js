import React from "react";
import { Outlet } from "react-router-dom";

function ManagerBlog() {
    return ( 
        <div>
            <Outlet/>
        </div>
     );
}

export default ManagerBlog;