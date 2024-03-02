import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAnchor, faBars, faNewspaper, faUserGroup, faBookBookmark, faBookOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery'; // Import jQuery here
import {Link, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {auth} from '../../../firebase.js';
import {AuthContext} from '../../../context/AuthContext.js'

import './Layout.css';

function Layout() {    
    const {currentUser}=useContext(AuthContext);
    const mobileScreen = window.matchMedia("(max-width: 990px )");
    function ClickMenuBar() {
        if (mobileScreen.matches) {
            $(".dashboard-nav").toggleClass("mobile-show");
        } else {
            $(".dashboard").toggleClass("dashboard-compact");
        }
    }
    function ShowDropDown(event) {
        var DropDown = event.target;
        $(DropDown).closest(".dashboard-nav-dropdown")
            .toggleClass("show")
            .find(".dashboard-nav-dropdown")
            .removeClass("show");
        $(DropDown).parent()
            .siblings()
            .removeClass("show");
    }
    
    return (
        <div class='dashboard'>
            <div class="dashboard-nav">
                <header>
                    <a href="/" class="menu-toggle">
                        <FontAwesomeIcon className="Icon" icon={faBars}/>
                    </a>
                    <a href="/" class="brand-logo">
                        <FontAwesomeIcon className="Icon" icon={faAnchor} /> 
                        <span>BRAND</span>
                    </a>
                </header>
                <nav class="dashboard-nav-list">
                    <Link to="/" className="dashboard-nav-item">
                        <FontAwesomeIcon className="Icon" icon={faHome} />
                        Trang chủ
                    </Link>
                    <a href="/CourseOutline" class="dashboard-nav-item active">
                        <FontAwesomeIcon className="Icon" icon={faBookBookmark} />
                        Lộ trình
                    </a>
                    <div class='dashboard-nav-dropdown'>
                        <Link to="/Course"  onClick={ShowDropDown} class="dashboard-nav-item dashboard-nav-dropdown-toggle" style={{border: 0}}>
                            <FontAwesomeIcon className="Icon" icon={faBookOpen} /> Các khóa học
                        </Link>
                        <div class='dashboard-nav-dropdown-menu'>
                            <a href="/" class="dashboard-nav-dropdown-item">Tất cả</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Back-End</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Font-End</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Data</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Tiếng anh</a>
                            <a href="/" class="dashboard-nav-dropdown-item">AI</a>
                        </div>
                    </div>
                    <a href="/Group" class="dashboard-nav-item"><FontAwesomeIcon className="Icon" icon={faUserGroup} />Các lớp học </a>
                    <a href="/Blog" class="dashboard-nav-item"><FontAwesomeIcon className="Icon" icon={faNewspaper}/> Bài viết </a>
                    <a href="/Profile" class="dashboard-nav-item"><FontAwesomeIcon className="Icon" icon={faUser}/> Trang cá nhân </a>
                    <div class="nav-item-divider"></div>
                    <button onClick={()=> signOut(auth)} class="dashboard-nav-item"><i class="fas fa-sign-out-alt"></i> Đăng xuất </button>
                </nav>
            </div>
            <div class='dashboard-app'>
                <header class='dashboard-toolbar'>
                    <button onClick={ClickMenuBar} href="/" class="menu-toggle">
                        <FontAwesomeIcon className="Icon" icon={faBars} />
                    </button>
                    {
                        currentUser==null ? <a href='/Login' className="btn btn-primary" style={{ marginLeft: 'auto' }}>Đăng nhập</a>
                            : <div class="flex items-center mr-auto" style={{marginLeft: '85%'}}>
                                <div class="inline-flex w-12 h-12">
                                    <img src={currentUser.photoURL} alt="aji" class=" relative w-12 h-12 object-cover rounded-2xl" />
                                    <span></span>
                                </div>
                                <div class="flex flex-col ml-3">
                                    <div class="font-medium leading-none text-black-500">{currentUser.displayName}</div>
                                    <p class="text-sm text-gray-500 leading-none mt-1">UI/UX Designer</p>
                                </div>
                            </div>
                    }
                </header>
                <div class='dashboard-content'>
                    <Outlet/>
                </div>
                {/* <Footer></Footer> */}
            </div>
        </div>
    );
}

export default Layout;

