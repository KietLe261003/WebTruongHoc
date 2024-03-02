import React, { useState} from "react";
import InputItem from "./Inputitem";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {auth} from '../../firebase'
function ListInputLogin() {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        
        console.log(email);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setErr(true);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <InputItem type="email" label="Email" />
            <InputItem type="password" label="Password" />
            <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
            {err && <span>Sai email hoặc mật khẩu không tồn tại</span>}
            <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
        </form>
    );
}

export default ListInputLogin;