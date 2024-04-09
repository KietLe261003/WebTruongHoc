import React, { useState } from "react";
import DetailActiveUser from "./DetailActiveUser";
import AcceptCertificate from "./AcceptCertificate";
const btnCheck={
    check: "px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300",
    unCheck: "px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
}
function TableDetailCertificate(props) {
    const certificateUser = props.certificateUser;
    const active = props.activeType2;
    const idCourse = props.idCourse;
    const [certificate,setCertificate]=useState(certificateUser);
    const handleSearch = (txt)=>{
        setCertificate(certificateUser.filter(item => item.name.includes(txt) || item.IdUser.includes(txt) || item.address.includes(txt) || item.phoneNumber.includes(txt) || item.email.includes(txt)))
    }
    const [checkBtn,setCheckBtn]=useState(0);
    const handleFilter = (e) =>{
        if(e===0)
        setCertificate(certificateUser);
        else if(e===1)
        setCertificate(certificateUser.filter(item => item.status===0))
        else if(e===2)
        setCertificate(certificateUser.filter(item => item.status===1))
        else if(e===3)
        setCertificate(certificateUser.filter(item => item.status===-1))

        setCheckBtn(e);
    }
    return (
        active &&
        <div>
            <div class="mt-6">
                <div class="flex items-center gap-x-3">
                    <h2 class="text-lg font-medium text-gray-800 dark:text-white">Bộ lọc</h2>

                    <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">240 vendors</span>
                </div>

                <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">These companies have purchased in the last 12 months.</p>
            </div>
            <div class="mb-6 md:flex md:items-center md:justify-between">
                <div class="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                    <button onClick={()=>{handleFilter(0)}} class={checkBtn===0 ? btnCheck.check : btnCheck.unCheck}>
                        Tất cả
                    </button>
                    <button onClick={()=>{handleFilter(1)}} class={checkBtn===1 ? btnCheck.check : btnCheck.unCheck}>
                        Chưa được duyệt
                    </button>

                    <button onClick={()=>{handleFilter(2)}} class={checkBtn===2 ? btnCheck.check : btnCheck.unCheck}>
                        Đã chấp nhận
                    </button>

                    <button onClick={()=>{handleFilter(3)}} class={checkBtn===3 ? btnCheck.check : btnCheck.unCheck}>
                        Đã Hủy
                    </button>
                </div>

                <div class="relative flex items-center mt-4 md:mt-0">
                    <span class="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </span>

                    <input type="text" placeholder="Search" onChange={(e)=>{handleSearch(e.target.value)}} class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>
            </div>
            {
                certificateUser &&
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <button class="flex items-center gap-x-3 focus:outline-none">
                                    <span>IdUser</span>
                                    <svg class="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                                        <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                                        <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" />
                                    </svg>
                                </button>
                            </th>
                            <th scope="col" class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                Tên người nhận
                            </th>
                            <th scope="col" class="px-4 py-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                Email
                            </th>
                            <th scope="col" class="px-3 py-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Số điện thoại</th>
                            <th scope="col" class="px-4 py-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Địa chỉ</th>
                            <th scope="col" class="px-4 py-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 ">Thao tác</th>
                            <th scope="col" class="px-4 py-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 flex justify-center">Bài tập của học viên</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                        {
                            certificate.map((item) => (
                                <tr>
                                    <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                        <div>
                                            <h2 class="font-medium text-gray-800 dark:text-white">{item.IdUser}</h2>
                                        </div>
                                    </td>
                                    <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                        <h4 class="text-gray-700 dark:text-gray-200">{item.name}</h4>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700 dark:text-gray-200">{item.email}</h4>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div class="flex items-center">
                                            {item.phoneNumber}
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div class="flex items-center ">
                                            {item.address}
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <AcceptCertificate inforUser={item} idCourse={idCourse} reason={item.reason}/>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}>
                                            <DetailActiveUser role={1} active={active} IdUser={item.IdUser}></DetailActiveUser>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }        
                    </tbody>
                </table>
            }
        </div>
    );
}

export default TableDetailCertificate
