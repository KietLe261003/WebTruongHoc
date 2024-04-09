import React from "react";
import TableUser from '../Components/TableUser.js';
import { Button } from "flowbite-react";
function ManagerUser() {
    const column = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "name", headerName: "Họ và tên", width: 400 },
        { field: "email", headerName: "Email", width: 300 },
        { field: "birthDate", headerName: "Ngày sinh", width: 100 },
        { field: "address", headerName: "Địa chỉ", width: 100 },
        { field: "role", headerName: "Quyền", width: 100 },
        {
            field: "btn", headerName: "", width: 345,
            renderCell: () => {
                return (
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <Button color="blue">Chi tiết</Button>
                        <Button color="failure">Xóa</Button>
                    </div>
                );
            },
        },
    ]
    return (
        <div>
            ManagerUser
            <TableUser column={column}></TableUser>
        </div>
    );
}

export default ManagerUser;