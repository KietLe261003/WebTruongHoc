import React from "react";
import CreateCourse from "../../Components/CreateCourse";
import DataTable from "../../Components/TableCourse";
function DashBoard() {
    return ( 
        <div>
            <CreateCourse/>
            <DataTable/>
        </div>
     );
}

export default DashBoard;