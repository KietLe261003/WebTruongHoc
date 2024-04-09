import React, { useState} from "react";
import InputItem from "./Inputitem";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {auth, db} from '../../firebase'
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Modal from 'react-modal';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px'
    },
};
function ListInputLogin() {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        
        console.log(email);
        try {
            const q = query(collection(db,"users"),where("email","==",email));
            const getUser = await getDocs(q)
            if(getUser.docs.length > 0)
            {
                await signInWithEmailAndPassword(auth, email, password);
                if(getUser.docs[0].data().password!==password)
                {
                    await updateDoc(doc(db,"users",getUser.docs[0].data().id),{
                        password: password
                    })
                }
                navigate('/');
            }
            else
            {
                setErr("Tài khoản đã bị cấm bởi hệ thống");
            }
        } catch (error) {
            setErr("Sai email hoặc mật khẩu");
        }
    };
    const [emailReset, setEmailReset] = useState("");
    const [menuChangeEmail, setMenuChangeEmail] = useState(false);
    const handleFogotPassWord = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, emailReset)
          .then(async () => {
            setMenuChangeEmail(false);
            alert("Vui lòng kiểm tra email để đặt lại mật khẩu !");
            setEmailReset("");
            console.log("Thành công");
          })
          .catch((error) => {
            console.log("Lỗi");
          });
      };
      const closeModal=()=>{
        setMenuChangeEmail(false);
      }
    return (
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: 'column'}}>
            <InputItem type="email" label="Email" />
            <InputItem type="password" label="Password" />
            <button class="small mb-5 pb-lg-2" type="button" onClick={()=>{setMenuChangeEmail(true)}}>Forgot password?</button>
            <button class="small mb-5 pb-lg-2" type="button" onClick={()=>{setMenuChangeEmail(true)}}>Change password?</button>
            {<span>{err}</span>}
            <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
            <Modal
                isOpen={menuChangeEmail}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <div class="bg-blue-400" style={{
                    height: "80px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Điền email muốn đặt lại mật khẩu</p>
                    </div>
                    <div style={{ flex: "0.5",display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModal} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
                  <form action="#">
                    <div class="mb-4">
                      <label
                        for="text"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email Tài khoản
                      </label>
                      <input
                        value={emailReset}
                        onChange={(e) => {
                          setEmailReset(e.target.value);
                        }}
                        type="text"
                        id="text"
                        class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div class="mb-4">
                        <button type="button" onClick={handleFogotPassWord} class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Gửi</button>
                    </div>
                    {err && <span className="text-red-500">{err}</span>}
                  </form>
                </div>
              </Modal>
        </form>
    );
}

export default ListInputLogin;