import React from "react";
import './Login.css';
import { Link } from "react-router-dom";
import Header from '../../../src/Components/Login/Header';
import ListInput from '../../../src/Components/Login/ListInput';
import ListIcon from '../../../src/Components/Login/ListIcon';
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
                                    <ListInput/>
                                    <ListIcon/>
                                </div>
                                <div>
                                    <p class="mb-0">Don't have an account? <Link to={"/Login"} class="text-white-50 fw-bold">Sign In</Link>
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