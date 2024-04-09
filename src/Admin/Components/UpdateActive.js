import { Timestamp, doc, updateDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db, storage } from "../../firebase";
import Modal from 'react-modal';
import { Button } from "flowbite-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import UpdateActiveCode from "./UpdateActiveCode";
import UpdateActiveDoc from "./UpdateActiveDoc";
import UpdateActiveQuiz from "./UpdateActiveQuiz";
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
function UpdateActive(props) {
    const activeUpdate=props.activeUpdate;
    const IdCourse = props.IdCourse;
    const nameRoadMap=props.nameRoadMap;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const [srcVideo, setSrcVideo] = useState(null);
    const videoRef = useRef(null);
    const [description,setDescription]=useState(activeUpdate.type===1 ? "" : activeUpdate.content);
    const [nameActive1,setNameActive1]=useState(activeUpdate.nameActive);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    function openVideoSrc(it) {
        setSrcVideo(it);
        setOpenVideo(true);
    };
    function closeVideo() {
        setOpenVideo(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(activeUpdate.type===1)
        {
            let nameActive = e.target[2].value;
            const video = e.target[3].files[0];
    
            if(nameActive!=null || video!=null)
            {
                if(nameActive==="")
                nameActive=activeUpdate.nameActive; 
                const storageRef = ref(storage,`Video/${IdCourse+"/"+nameRoadMap+"/"+nameActive}`);
                const timeUpdate=Timestamp.now();
                if(video!=null)
                {
                    await uploadBytesResumable(storageRef,video).then(() =>{
                        getDownloadURL(storageRef).then(async (downloadURL)=>{
                            try {
                                await updateDoc(doc(db,"active",activeUpdate.id),{
                                    nameActive: nameActive,
                                    videoURL: downloadURL,
                                    timeUpdate: timeUpdate
                                })
                                alert("Sửa thành công");
                                window.location.reload();
                                closeModal();
                            } catch (error) {
                                console.log(error);
                                alert("Lỗi trong quá trình xử lý");
                            }
                        })
                    })
                }
                else
                {
                    try {
                        await updateDoc(doc(db,"active",activeUpdate.id),{
                            nameActive: nameActive,
                            timeUpdate: timeUpdate
                        })
                        alert("Sửa thành công");
                        window.location.reload();
                        closeModal();
                    } catch (error) {
                        console.log(error);
                        alert("Lỗi trong quá trình xử lý");
                    }
                }
            }
        }
        else
        {
            try {
                await updateDoc(doc(db,"active",activeUpdate.id),{
                    nameActive: nameActive1,
                    content: description
                })
                alert("Sửa thành công");
                window.location.reload();
                closeModal();
            } catch (error) {
                console.log(error);
                alert("Lỗi trong quá trình xử lý");
            }
        }
    }
    return ( 
        <div>
            <Button onClick={() => openModal()} color="warning">Sửa</Button>
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Sửa hoạt động</p>
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
                <div style={{ padding: "20px" }}>
                    <span>{activeUpdate.id}</span>
                    {
                        activeUpdate.type===1 ?
                        <form onSubmit={handleSubmit}>
                            <div class="grid md:grid-cols-2 grid-cols-1 gap-6 mb-3">
                                <p class=" font-bold text-orange-400">Nội dung trước khi sửa</p>
                                <div class="md:col-span-2 w-full">
                                    <input type="text" id="fname" name="fname" placeholder="Tên hoạt động"
                                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                        value={activeUpdate != null ? activeUpdate.nameActive : ''}
                                    />
                                </div>
                                <div class="md:col-span-2">
                                    <button type="button" 
                                        onClick={() => openVideoSrc(activeUpdate.videoURL)}
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex justify-center">
                                        Video
                                    </button>
                                </div>
                            </div>
                            <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <p class=" font-bold text-green-400">Nội dung muốn cập nhật</p>
                                <div class="md:col-span-2 w-full">
                                    <input type="text" id="fname" name="fname" placeholder="Tên hoạt động"
                                        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                    />
                                </div>
                                <div class="md:col-span-2">
                                    <input type="file" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none bg-slate-400" />
                                </div>
                                
                                <div class="md:col-span-2">
                                    <button
                                        type="submit"
                                        class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Cập nhật</button>
                                </div>
                            </div>
                        </form>
                        : 
                        activeUpdate.type===2 ?
                        <form onSubmit={handleSubmit}>
                                <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                    <div class="md:col-span-2 w-full">
                                        <input type="text" id="fname" name="fname" placeholder="Tên hoạt động"
                                            value={nameActive1}
                                            onChange={(e)=>setNameActive1(e.target.value)}
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
                                                <textarea id="editor" rows="15"  class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                                                placeholder="Viết nộp dung bài tập" value={description} onInput={(e)=>setDescription(e.target.value)} required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="md:col-span-2">
                                        <button
                                            type="submit"
                                            class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo </button>
                                    </div>
                                </div>
                            </form>:
                            activeUpdate.type===3 ?
                            <UpdateActiveCode activeUpdate={activeUpdate}></UpdateActiveCode> :
                            activeUpdate.type===4 ?
                            <UpdateActiveDoc activeUpdate={activeUpdate} idCourse={IdCourse}></UpdateActiveDoc> :
                            <UpdateActiveQuiz activeUpdate={activeUpdate}></UpdateActiveQuiz>
                    }
                </div>
            </Modal>
            <Modal
                isOpen={openVideo}
                onRequestClose={closeVideo}
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Video của hoạt động</p>
                    </div>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeVideo} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                {
                    srcVideo &&
                    <div style={{ width: 1000, height: 550 }}>
                        <div style={{height: '50', backgroundColor: 'black'}}></div>
                        <video
                            ref={videoRef}
                            class="w-full h-full" controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                        >
                            <source
                                src={srcVideo}
                                type="video/mp4"></source>
                        </video>
                    </div>
                }
            </Modal>
        </div>
     );
}

export default UpdateActive;