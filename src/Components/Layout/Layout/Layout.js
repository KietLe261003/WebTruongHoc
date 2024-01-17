import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAnchor, faBars, faNewspaper, faUserGroup, faBookBookmark, faBookOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery'; // Import jQuery here
import { Routes, Route , Link } from 'react-router-dom';



import './Layout.css';

import Home from '../../../Page/Home/Index.js'
import Course from '../../../Page/Course/Index.js';
import CourseOutline from '../../../Page/Course_Outline/Index.js';
import Group from '../../../Page/Group/Index.js';
import Class from '../../../Page/Class/Index.js';
import Blog from '../../../Page/Blog/Index.js';
import Profile from '../../../Page/Profile/Index.js';
function Layout() {    
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
                    <a href="/Login" class="dashboard-nav-item"><i class="fas fa-sign-out-alt"></i> Đăng xuất </a>
                </nav>
            </div>
            <div class='dashboard-app'>
                <header class='dashboard-toolbar'>
                    <button onClick={ClickMenuBar} href="/" class="menu-toggle">
                        <FontAwesomeIcon className="Icon" icon={faBars} />
                    </button>
                    <a href='/Login' className="btn btn-primary" style={{ marginLeft: 'auto' }}>Đăng nhập</a>
                </header>
                <div class='dashboard-content'>
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                        <Route path='/CourseOutline' element={<CourseOutline/>}/>
                        <Route path='/Course' element={<Course/>}/>
                        <Route path='/Group' element={<Group/>}/>
                        <Route path='/Class' element={<Class/>}/>
                        <Route path='/Blog' element={<Blog/>}/>
                        <Route path='/Profile' element={<Profile/>}/>
                    </Routes>
                </div>
                {/* <Footer></Footer> */}
            </div>
        </div>
    );
}

export default Layout;

