import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
function Header(props) {
    const nameCourse = props.nameCourse;
    const sumActive = props.sumActive;
    const indexActive = props.indexActive;
    const idActive = props.idActive;
    const { currentUser } = useContext(AuthContext);
    const [isDrawerOpen1, setIsDrawerOpen1] = useState(false);
    
    const [notes,setNotes]=useState(Array.from({length: 0}));
    const toggleDrawer1 = () => {
        setIsDrawerOpen1(!isDrawerOpen1);
    };
    useEffect(() => {
        const getNotes = async () => {
            const docUser = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docUser.data().id;
            const q = query(collection(db, "detailActive"), where("IdActive", "==", idActive), where("IdUser", "==", idUser));
            onSnapshot(q, (doc) => {
                doc.forEach((it)=>{
                    setNotes(it.data().notes);
                })
            });  
        }
        getNotes();
    }, [currentUser,idActive])
    return (
        <header class="w-full text-white bg-gray-700 shadow-sm body-font">
            <div class="w-full container flex flex-col items-start p-3 mx-auto md:flex-row">
                <div class="ml-2 font-bold" style={{ fontSize: "1.4rem" }}>
                    {nameCourse}
                </div>
                <nav class="flex items-center justify-center text-base md:ml-auto">
                    <p class="mr-5 font-medium">{indexActive}/{sumActive} bài học</p>
                    <div className="flex relative">
                        <input type="checkbox" id="drawer-toggle1" className="absolute sr-only" checked={isDrawerOpen1} onChange={toggleDrawer1} />
                        <label htmlFor="drawer-toggle1" className="mr-5 font-medium hover:text-gray-900 cursor-pointer">
                            Ghi chú
                        </label>
                        <div style={{ width: '40%' }} className={`fixed top-0 right-0 z-20 h-full transition-all duration-500 transform ${isDrawerOpen1 ? '' : 'translate-x-full'} bg-white shadow-lg`}>
                            <div class="bg-white" style={{
                                height: "80px",
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                            }}>
                                <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                                    <p style={{ fontSize: 25, fontWeight: "bold", color: 'black' }}>Ghi chú của tôi</p>
                                </div>
                                <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                                    <button type="button" onClick={toggleDrawer1} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                                        <span class="sr-only">Close</span>
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <ul class="flex flex-col  p-2  rounde-lg" aria-labelledby="dropdownDefaultButton">
                                {
                                    notes!=null ?
                                    notes.map((it) => (
                                        <li
                                            className="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full border-white
            cursor-pointer border-2 rounded-lg disabled} mb-2"
                                        >
                                            <div className=" block px-4 py- dark:hover:bg-gray-600 dark:hover:text-white text-black">
                                               {it.timeNote} {it.note}
                                            </div>
                                        </li>
                                    )) :
                                    <div>Chả có cái j cả</div>
                                }
                            </ul>
                        </div>
                    </div>
                    <a href="#_" class="font-medium hover:text-gray-900">Liên hệ</a>
                </nav>
                <div class="items-center h-full pl-6 ml-6 border-l border-gray-200">
                    <a href="/" class="mr-5 font-medium hover:text-gray-900">Trang chủ</a>
                </div>
            </div>
        </header>
    );
}

export default Header;