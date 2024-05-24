import React, { useContext, useState } from "react";
import Modal from "react-modal";
import {v4 as uuid} from 'uuid';
import { db, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../../context/AuthContext";
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
function CreateCourse() {
    const {currentUser}=useContext(AuthContext);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [err,setErr] = useState(false);
    const [InputPrice,setInputPrice] = useState(false);
    const [priceCourse,setPriceCourse] = useState(0);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
        setInputPrice(false);
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(e);
        const id =uuid();
        const nameCourse=e.target[0].value;
        const photoURL=e.target[1].files[0];
        const description=e.target[2].value;
        const types= e.target[3].value;
        const storageRef = ref(storage,`Course/${nameCourse+id}`);
        try {
            await uploadBytesResumable(storageRef, photoURL).then(()=>{
                getDownloadURL(storageRef).then( async (dowloadURL)=>{
                    try {
                        const getUser= await getDoc(doc(db,"users",currentUser.uid));
                        const teacher=getUser.data().id;
                        await setDoc(doc(db,"course",id),{
                            id: id,
                            nameCourse: nameCourse,
                            teacher: teacher,
                            type: types,
                            photoURL: dowloadURL,
                            description: description,
                            isPublic: false,
                            time: 0,
                            final: 0,
                            priceCourse: priceCourse,
                            sumActive: 0,
                            rating: 0,
                            comment: [],
                        })
                        await setDoc(doc(db,"certificate",id),{
                            id: id,
                            users: []
                        })
                        setIsOpen(false);
                        window.location.reload();
                    } catch (error) {
                        setErr(true);
                    }
                })
            })
        } catch (err) {
            setErr(true);
        }      
    }
    const handleCheckType = (e) => {
        const valu = e.target.value;
        if(valu==="1")
        {
            setInputPrice(true);
        }
        else 
        {
            setInputPrice(false);
        }
    }
    return (
        <div>
            <button
                onClick={openModal}
                type="button"
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Tạo khóa học
            </button>
            {err && <span>Lỗi tạo khóa học</span>}
            <Modal
                isOpen={modalIsOpen}
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Tạo Khóa học mới</p>
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
                                <input type="text" id="fname" name="fname" placeholder="Tên khóa học"
                                    class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                />
                            </div>  
                            <div class="md:col-span-2">
                                <label for="subject" class="float-left block  font-normal text-gray-400 text-lg">Chọn hình ảnh của khóa học:</label>
                                <input type="file" id="file" name="file" placeholder="Charger votre fichier" class="peer block w-full appearance-none border-none   bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0" />
                            </div>
                            <div class="md:col-span-2">
                                <textarea name="message" rows="5" cols="" placeholder="Mô tả khóa học" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <label for="subject" class="float-left block  font-normal text-gray-400 text-lg">Loại khóa học:</label>
                                <select onChange={handleCheckType} id="subject" name="subject" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700">
                                    <option value="0">Miễn phí</option>
                                    <option value="1">Trả phí</option>
                                </select>
                            </div>
                            {
                                InputPrice &&
                                <div class="flex flex-col">
                                    <label for="price" class="mb-1 uppercase text-grey-darker text-xs font-bold">Giá tiền</label>
                                    <div class="flex flex-row">
                                        <input type="number" name="price" onChange={(e)=>setPriceCourse(e.target.value)} class="bg-grey-lighter text-grey-darker py-2  rounded text-grey-darkest border border-grey-lighter rounded-l-none font-bold"/>
                                        <span class="flex items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold text-grey-darker">vnđ</span>
                                    </div>
                                </div>
                            }
                            <div class="md:col-span-2">
                                <button class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo khóa học</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

        </div>
    );
}

export default CreateCourse;