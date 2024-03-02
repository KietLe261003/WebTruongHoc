import React from "react";
import NavItem from "./NavItem";
import { faBook, faUser, faCertificate } from '@fortawesome/free-solid-svg-icons';
function navBarAdmin() {
    const item =[
        {
            name: "User",
            icon: faUser,
            link: "/Admin/ManagerUser"
        },
        {
            name: "Cources",
            icon: faBook,
            link: "/Admin/ManagerCourse"
        },
        {
            name: "Certificate",
            icon: faCertificate,
            link: "/Admin/ManagerCertificate"
        },
    ]
    return ( 
        <nav class="w-64 flex-shrink-0">
                <div class="flex-auto bg-gray-900 h-full">
                    <div class="flex flex-col overflow-y-auto">
                        <ul class="relative m-0 p-0 list-none h-full">
                            <li class="text-white text-2xl p-4 w-full flex relative shadow-sm justify-start bg-gray-800 border-b-2 border-gray-700">
                                Admin 
                            </li>
                            <li class="text-white p-4 w-full flex relative shadow-sm justify-start bg-gray-800 border-b-2 border-gray-700">
                                <div class="mr-4 flex-shrink-0 my-auto">
                                    <svg class="fill-current w-5 h-5" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                                </div>
                                <div class="flex-auto my-1">
                                    <span>Project Overview</span>
                                </div>
                            </li>
                            <li class="p-4 w-full flex relative shadow-sm">
                                <div class="flex-auto my-1">
                                    <span class="text-white font-medium">Develop</span>
                                </div>
                            </li>
                            {
                                item.map((it)=>(
                                    <NavItem icon={it.icon} title={it.name} link={it.link}/>
                                ))
                            }
                           
                        </ul>
                    </div>
                </div>
            </nav>
     );
}

export default navBarAdmin;