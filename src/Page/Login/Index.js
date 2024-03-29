import React from "react";
import './Login.css';
import Header from '../../../src/Components/Login/Header';
import ListInputLogin from '../../../src/Components/Login/ListInputLogin'
import ListIcon from '../../../src/Components/Login/ListIcon';
import { Link } from "react-router-dom";
function Login() {
    return (
        <section class="vh-100 gradient-custom">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div class="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div class="card-body p-5 text-center">
                                <div class="mb-md-5 mt-md-4 pb-5">
                                    <Header/>
                                    <ListInputLogin/>
                                    <ListIcon/>
                                </div>
                                <div>
                                    <p class="mb-0">Don't have an account? <Link to={"/Regiter"} class="text-white-50 fw-bold">Sign Up</Link>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;