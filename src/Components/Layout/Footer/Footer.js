import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook,faTwitter,faGoogle,faInstagram,faLinkedin,faGithub } from "@fortawesome/free-brands-svg-icons";

import './Footer.css';
function Footer() {
    return (
        <div class="container my-5" className="Footer">
            <footer
                class="text-center text-lg-start text-dark"
                style={{backgroundColor: "#ECEFF1"}}
            >
                
                <section
                    class="d-flex justify-content-between p-4 text-white"
                    style={{backgroundColor: "#21D192"}}
                >
                    
                    <div class="me-5">
                        <span>Get connected with us on social networks:</span>
                    </div>
                    

                   
                    <div>
                        <a href="/" class="text-white me-4">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="/" class="text-white me-4">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="/" class="text-white me-4">
                            <FontAwesomeIcon icon={faGoogle} />
                        </a>
                        <a href="/" class="text-white me-4">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="/" class="text-white me-4">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                        <a href="/" class="text-white me-4">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </div>
                    
                </section>
                

                
                <section class="">
                    <div class="container text-center text-md-start mt-5">
                
                        <div class="row mt-3">
                            
                            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                
                                <h6 class="text-uppercase fw-bold">Company name</h6>
                                <hr
                                    class="mb-4 mt-0 d-inline-block mx-auto"
                                    style={{width: "60px", backgroundColor: "#7c4dff", height: "2px"}}
                                />
                                <p>
                                    Here you can use rows and columns to organize your footer
                                    content. Lorem ipsum dolor sit amet, consectetur adipisicing
                                    elit.
                                </p>
                            </div>
                    
                            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            
                                <h6 class="text-uppercase fw-bold">Products</h6>
                                <hr
                                    class="mb-4 mt-0 d-inline-block mx-auto"
                                    style={{width: "60px", backgroundColor: "#7c4dff", height: "2px"}}
                                />
                                <p>
                                    <a href="#!" class="text-dark">MDBootstrap</a>
                                </p>
                                <p>
                                    <a href="#!" class="text-dark">MDWordPress</a>
                                </p>
                                <p>
                                    <a href="#!" class="text-dark">BrandFlow</a>
                                </p>
                                <p>
                                    <a href="#!" class="text-dark">Bootstrap Angular</a>
                                </p>
                            </div>
                        
                            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            
                                <h6 class="text-uppercase fw-bold">Useful links</h6>
                                <hr
                                    class="mb-4 mt-0 d-inline-block mx-auto"
                                    style={{width: "60px", backgroundColor: "#7c4dff", height: "2px"}}
                                />
                                <p>
                                    <a href="#!" class="text-dark">Your Account</a>
                                </p>
                                <p>
                                    <a href="#!" class="text-dark">Become an Affiliate</a>
                                </p>
                                <p>
                                    <a href="#!" class="text-dark">Shipping Rates</a>
                                </p>
                                <p>
                                    <a href="#!" class="text-dark">Help</a>
                                </p>
                            </div>
                            
                            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 class="text-uppercase fw-bold">Contact</h6>
                                <hr
                                    class="mb-4 mt-0 d-inline-block mx-auto"
                                    style={{width: "60px", backgroundColor: "#7c4dff", height: "2px"}}
                                />
                                <p><i class="fas fa-home mr-3"></i> New York, NY 10012, US</p>
                                <p><i class="fas fa-envelope mr-3"></i> info@example.com</p>
                                <p><i class="fas fa-phone mr-3"></i> + 01 234 567 88</p>
                                <p><i class="fas fa-print mr-3"></i> + 01 234 567 89</p>
                            </div>
                        </div>
                    </div>
                </section>
            </footer>
        </div>

    );
}
export default Footer;