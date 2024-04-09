import React from "react";
import NavItem from "./NavItem";
import { faBook, faUser, faCertificate, faBookAtlas, faSignOut, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function navBarAdmin(props) {
    const role = props.role;
    const item = [
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
        {
            name: "Blog",
            icon: faBookAtlas,
            link: "/Admin/ManagerBlog"
        },
        {
            name: "Report",
            icon: faFileAlt,
            link: "/Admin/ManagerReport"
        },
    ]
    const item1 = [
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
    ];
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
                            role === "admin" ?
                                item.map((it) => (
                                    <NavItem icon={it.icon} title={it.name} link={it.link} />
                                )) :
                                item1.map((it) => (
                                    <NavItem icon={it.icon} title={it.name} link={it.link} />
                                ))
                        }
                        <button onClick={() => signOut(auth)} class="text-blue-400 flex relative px-4 hover:bg-gray-700 cursor-pointer m-3">
                            <div class="mr-4">
                                <svg class="fill-current h-5 w-5" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                <FontAwesomeIcon icon={faSignOut} className=" mr-3" /> Đăng xuất
                                </svg>
                            </div>
                            <div class="flex-auto my-1">
                                <span>Đăng xuất</span>
                            </div>
                        </button>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default navBarAdmin;