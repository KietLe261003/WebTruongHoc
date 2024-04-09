import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAnchor, faBars, faNewspaper, faBookOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery'; // Import jQuery here
import {Link, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {auth} from '../../../firebase.js';
import {AuthContext} from '../../../context/AuthContext.js'
import Footer from '../Footer/Footer.js'
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
    const [checkActive,setCheckActive]=useState(0);

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
                    <Link to="/" onClick={()=>{setCheckActive(0)}} className={`dashboard-nav-item ${checkActive===0 && "active"}`}>
                        <FontAwesomeIcon className="Icon" icon={faHome} />
                        Trang chủ
                    </Link>
                    <Link to="/Course" onClick={()=>{setCheckActive(1)}} className={`dashboard-nav-item ${checkActive===1 && "active"}`} style={{border: 0}}>
                        <FontAwesomeIcon className="Icon" icon={faBookOpen} /> Các khóa học
                    </Link>
                    <Link to="/Blog" onClick={()=>{setCheckActive(2)}} className={`dashboard-nav-item ${checkActive===2 && "active"}`}>
                        <FontAwesomeIcon className="Icon" icon={faNewspaper}/> Bài viết 
                    </Link>
                    <Link to="/Profile" onClick={()=>{setCheckActive(3)}} className={`dashboard-nav-item ${checkActive===3 && "active"}`} >
                        <FontAwesomeIcon className="Icon" icon={faUser}/> Trang cá nhân 
                    </Link>
                    <div class="nav-item-divider"></div>
                    <button onClick={()=> signOut(auth)} ><i class="fas fa-sign-out-alt"></i> Đăng xuất </button>
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
                <Footer></Footer>
            </div>
        </div>
    );
}

export default Layout;

