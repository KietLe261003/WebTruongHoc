import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUpload, faAnchor, faBars } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery'; // Import jQuery here
import { Routes, Route } from 'react-router-dom';


import './Header.css';
import Login from '../../View/Login/Login';
import Footer from '../Footer/Footer';



function Header() {    
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
                    <a href="/" class="dashboard-nav-item">
                        <FontAwesomeIcon className="Icon" icon={faHome} />
                        Home
                    </a>
                    <a href="/" class="dashboard-nav-item active">
                        <i class="fas fa-tachometer-alt"></i>
                        dashboard
                    </a>
                    <a href="/" class="dashboard-nav-item">
                        <FontAwesomeIcon className="Icon" icon={faUpload} />
                        Upload 
                    </a>
                    <div class='dashboard-nav-dropdown'>
                        <button onClick={ShowDropDown} class="dashboard-nav-item dashboard-nav-dropdown-toggle" style={{border: 0}}>
                            <i class="fas fa-photo-video"></i> Media
                        </button>
                        <div class='dashboard-nav-dropdown-menu'>
                            <a href="/" class="dashboard-nav-dropdown-item">All</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Recent</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Images</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Video</a>
                        </div>
                    </div>
                    <div class='dashboard-nav-dropdown'>
                        <button onClick={ShowDropDown} href="/!" class="dashboard-nav-item dashboard-nav-dropdown-toggle" style={{border: 0}}>
                            <i class="fas fa-users"></i> Users
                        </button>
                        <div class='dashboard-nav-dropdown-menu'>
                            <a href="/" class="dashboard-nav-dropdown-item">All</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Subscribed</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Non-subscribed</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Banned</a>
                            <a href="/" class="dashboard-nav-dropdown-item">New</a>
                        </div>
                    </div>
                    <div class='dashboard-nav-dropdown'>
                        <button onClick={ShowDropDown} href="/!" class="dashboard-nav-item dashboard-nav-dropdown-toggle" style={{border: 0}}>
                            <i class="fas fa-money-check-alt"></i> Payments
                        </button>
                        <div class='dashboard-nav-dropdown-menu'>
                            <a href="/" class="dashboard-nav-dropdown-item">All</a>
                            <a href="/" class="dashboard-nav-dropdown-item">Recent</a>
                            <a href="/" class="dashboard-nav-dropdown-item"> Projections</a>
                        </div>
                    </div>
                    <a href="/" class="dashboard-nav-item"><i class="fas fa-cogs"></i> Settings </a>
                    <a href="/" class="dashboard-nav-item"><i class="fas fa-user"></i> Profile </a>
                    <div class="nav-item-divider"></div>
                    <a href="/Login" class="dashboard-nav-item"><i class="fas fa-sign-out-alt"></i> Logout </a>
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
                    <div class='container'>
                        <div class='card'>
                            <Routes>
                                <Route path='/Login' element={<Login/>}></Route>
                            </Routes>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </div>
    );
}

export default Header;

