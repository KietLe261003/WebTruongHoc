import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import Modal from 'react-modal';
import { db, storage } from "../../firebase";
import {v4 as uuid} from 'uuid';
import { AuthContext } from "../../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
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
function RequestTeacher() {
    const [isOpen,setIsOpen]=useState(false);
    const closeModal = ()=>{
        setIsOpen(false);
    }
    const {currentUser}= useContext(AuthContext);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(e);
        const id =uuid();
        const nameReport=e.target[0].value;
        const photoURL=e.target[1].files[0];
        const description=e.target[2].value;
        const storageRef = ref(storage,`Report/${nameReport+id}`);
        try {
            await uploadBytesResumable(storageRef, photoURL).then(()=>{
                getDownloadURL(storageRef).then( async (dowloadURL)=>{
                    try {
                        await setDoc(doc(db,"reports",id),{
                            id: id,
                            idUserReport: currentUser.uid,
                            idReport: null,
                            type: 3,
                            content: nameReport,
                            description: description,
                            photoURL: dowloadURL,
                            status: 0
                        })
                        setIsOpen(false);
                        alert("Gửi yêu cầu thành công chờ admin xét duyệt")
                    } catch (error) {
                        alert("Lỗi gửi yêu cầu thất bại !");
                        console.log(error)
                    }
                })
            })
        } catch (err) {
            alert("Lỗi tải hình !")
        }  
    }
    return ( 
        <div>
            <button 
                onClick={()=>setIsOpen(true)}
                type="button" 
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                Yêu cầu Giáo viên
            </button>
            <Modal
                isOpen={isOpen}
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Yêu cầu cấp tài khoản giáo viên</p>
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
                <div style={{ padding: "20px" }}>
                    <form onSubmit={handleSubmit}>
                        <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div class="md:col-span-2">
                                <input type="text" id="fname" name="fname" placeholder="Nội dung yêu cầu"
                                    class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                />
                            </div>  
                            <div class="md:col-span-2">
                                <label for="subject" class="float-left block  font-normal text-gray-400 text-lg">Chọn hình ảnh Cv hoặc chứng chỉ giáo dục:</label>
                                <input type="file" id="file" name="file" placeholder="Charger votre fichier" class="peer block w-full appearance-none border-none   bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0" />
                            </div>
                            <div class="md:col-span-2">
                                <textarea name="message" rows="5" cols="" placeholder="Điền mục đích sử dụng" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"></textarea>
                            </div>

                            
                            <div class="md:col-span-2">
                                <button class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Gửi yêu cầu</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

        </div>
     );
}

export default RequestTeacher;