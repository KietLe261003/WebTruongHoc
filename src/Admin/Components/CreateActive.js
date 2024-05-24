import Modal from "react-modal";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {  db, storage } from "../../firebase";
import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import CreateActiveCode from "./CreateActiveCode";
import CreateActiveDoc from "./CreateActiveDoc";
import CreateActiveQuiz from "./CreateActiveQuiz";
import { v4 as uuid } from "uuid";
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

function CreateActive(props) {
    const IdCourse = props.IdCourse;
    const IdRoadMap = props.IdRoadMap;
    //const nameRoadMap=props.nameRoadMap;
    const [openTab, setOpenTab] = useState(1);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState("");

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    // Khai báo state để lưu trữ tiến trình tải lên
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let id = uuid(); // hoặc giá trị ban đầu mong muốn
        if (openTab === 1) {
            const nameActive = e.target[0].value;
            const video = e.target[1].files[0];
            const storageRef = ref(storage, `Video/${IdCourse + "/" + IdRoadMap + "/" + id}`);
            const timeUpdate = Timestamp.now();
            
            
    
            const uploadTask = uploadBytesResumable(storageRef, video);
    
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Tính toán phần trăm tải lên và cập nhật tiến trình
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    // Xử lý lỗi nếu có
                    console.error(error);
                },
                async () => {
                    // Khi tải lên hoàn tất, lấy đường dẫn tải xuống và thực hiện các thao tác khác
                    const downloadURL = await getDownloadURL(storageRef);
                    try {
                        await setDoc(doc(db, "active", id), {
                            id: id,
                            idRoadMap: IdRoadMap,
                            nameActive: nameActive,
                            videoURL: downloadURL,
                            timeUpdate: timeUpdate,
                            timeCreate: timeUpdate,
                            type: 1
                        })
                        const docCourse = await getDoc(doc(db, "course", IdCourse));
                        const sumActive = docCourse.data().sumActive + 1;
                        await updateDoc(doc(db, "course", IdCourse), {
                            sumActive: sumActive
                        })
                        alert("Thêm thành công");
                        window.location.reload();
                        closeModal();
                    } catch (error) {
                        console.log(error);
                        alert("Lỗi trong quá trình xử lý");
                    }
                }
            );
        }
        else {
            const nameActive = e.target[0].value;
            const timeUpdate = Timestamp.now();
            try {
                await setDoc(doc(db, "active", id), {
                    id: id,
                    idRoadMap: IdRoadMap,
                    nameActive: nameActive,
                    content: description,
                    timeUpdate: timeUpdate,
                    timeCreate: timeUpdate,
                    type: 2
                })
                alert("Thêm thành công");
                window.location.reload();
                closeModal();
            } catch (error) {
                alert("lỗi cập nhật")
            }
        }
    }
    return (
        <div>
            <li onClick={openModal} class="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full hover:bg-gray-100 cursor-pointer border-2 rounded-lg">
                <FontAwesomeIcon class="h-6 w-6 mr-4 ml-3" icon={faPlus} />
                <div href="/" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Thêm nội dung </div>
            </li>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div class="bg-blue-400" style={{
                    height: "80px",
                    width: "800px",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Thêm hoạt động cho chương</p>
                    </div>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModal} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <header class="bg-white p-4 text-gray-700">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <button
                            onClick={() => setOpenTab(1)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 1 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Video
                        </button>
                        <button
                            onClick={() => setOpenTab(2)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 2 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Nộp file
                        </button>
                        <button
                            onClick={() => setOpenTab(3)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 3 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Code
                        </button>
                        <button
                            onClick={() => setOpenTab(4)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 4 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Tài liệu
                        </button>
                        <button
                            onClick={() => setOpenTab(5)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 5 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Trắc nghiệm
                        </button>
                    </div>
                </header>
                {
                    openTab === 1 ?
                        <div style={{ padding: "20px" }}>
                             {uploadProgress > 0 && 
                                <p>Đang tải {uploadProgress}</p>
                             }
                            <form onSubmit={handleSubmit}>
                                <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                    <div class="md:col-span-2 w-full">
                                        <input type="text" id="fname" name="fname" placeholder="Tên hoạt động"
                                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <input type="file" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none bg-slate-400" />
                                    </div>
                                    <div class="md:col-span-2">
                                        <button
                                            type="submit"
                                            class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo </button>
                                    </div>
                                </div>
                            </form>
                        </div> :
                        openTab === 2 ?
                            <div style={{ padding: "20px" }}>
                                <form onSubmit={handleSubmit}>
                                    <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                        <div class="md:col-span-2 w-full">
                                            <input type="text" id="fname" name="fname" placeholder="Tên hoạt động"
                                                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                            />
                                        </div>
                                        <div class="md:col-span-2 w-full">
                                            <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                                <div class="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
                                                    <div class="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                                                        <div class="flex items-center space-x-1 sm:pr-4">
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                        </div>
                                                        <div class="flex flex-wrap items-center space-x-1 sm:pl-4">
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                            <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button type="button" data-tooltip-target="tooltip-fullscreen" class="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                                    </button>
                                                    <div id="tooltip-fullscreen" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                                                        Show full screen
                                                        <div class="tooltip-arrow" data-popper-arrow></div>
                                                    </div>
                                                </div>
                                                <div class="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                                                    <label for="editor" class="sr-only">Publish post</label>
                                                    <textarea id="editor" rows="15" class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                                        placeholder="Viết nộp dung bài tập" value={description} onInput={(e) => setDescription(e.target.value)} required></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="md:col-span-2">
                                            <button
                                                type="submit"
                                                class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo </button>
                                        </div>
                                    </div>
                                </form>
                            </div> :
                            openTab===3 ?
                            <CreateActiveCode idRoadMap={IdRoadMap}></CreateActiveCode>:
                            openTab===4 ?
                            <CreateActiveDoc idRoadMap={IdRoadMap} idCourse={IdCourse}></CreateActiveDoc>:
                            <CreateActiveQuiz idRoadMap={IdRoadMap}></CreateActiveQuiz>
                            
                }
            </Modal>
        </div>
    );
}

export default CreateActive;