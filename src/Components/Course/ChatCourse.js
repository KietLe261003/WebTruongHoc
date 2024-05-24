import { Timestamp, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import ItemChat from "./ItemChat";
import {v4 as uuid} from 'uuid'


function ChatCourse(props) {
    const {currentUser}=useContext(AuthContext);
    const course = props.course;
    const [chat, setChat] = useState([]);
    useEffect(() => {
        scrollToBottom();
    }, [chat]); // Chỉ gọi một lần sau khi component được render

    function scrollToBottom() {
        var container = document.getElementById("body-message");
        container.scrollTop = container.scrollHeight;
    }
    // useEffect(() => {
    //     const check = async () => {
    //         const getChat = await getDoc(doc(db, "courseChat", course.id));
    //         if (!getChat.exists()) {
    //             await setDoc(doc(db, "courseChat", course.id), {
    //                 chat: []
    //             })
    //         }
    //     }
    //     const unsub = onSnapshot(doc(db, "courseChat", course.id), (it) => {
    //         console.log(it.data());
    //         setChat(it.data().chat);
    //     });
    //     return () => {
    //         check();
    //         unsub();
    //     }
    // }, [course.id])
    useEffect(() => {
        const checkAndUnsub = async () => {
            await check();
            const unsub = onSnapshot(doc(db, "courseChat", course.id), (it) => {
                console.log(it.data());
                setChat(it.data().chat);
            });
            return unsub;
        };
    
        const check = async () => {
            const getChat = await getDoc(doc(db, "courseChat", course.id));
            if (!getChat.exists()) {
                await setDoc(doc(db, "courseChat", course.id), {
                    chat: []
                });
            }
        };
    
        const unsubPromise = checkAndUnsub();
    
        return () => {
            unsubPromise.then(unsub => unsub());
        };
    }, [course.id]);
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        setShowOverlay(!showOverlay);
    };
    const [contentChat,setContentChat]=useState("");
    const handleChat = async ()=>{
        const time = Timestamp.now();
        const idChat = uuid();
        await updateDoc(doc(db,"courseChat",course.id),{
            chat: arrayUnion({
                idChat: idChat,
                idUser: currentUser.uid,
                content: contentChat,
                timeChat: time
            })
        })
        setContentChat("");
        scrollToBottom();
    }

    
    return (
        <div>
            <button onClick={toggleDrawer} class="py-4 border-b w-full border-gray-200 flex flex-row items-center justify-between hover:bg-slate-400">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Chat</p>
            </button>
            <div style={{ width: '50%', zIndex: 101 }} className={`fixed top-0 right-0 z-100 h-full transition-all duration-500 transform ${isDrawerOpen ? '' : 'translate-x-full'} bg-white shadow-lg`}>
                <div class="bg-white" style={{
                    height: "80px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}></div>
                <div class="bg-white" style={{
                    height: "80px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 25, fontWeight: "bold", color: 'black' }}>Chat Khóa học</p>
                    </div>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={toggleDrawer} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <div class="bg-gray-100 h-screen flex flex-col w-full" style={{maxHeight: 750}}>
                        <div class="flex-1 overflow-y-auto" id="body-message">
                            <div class="flex flex-col space-y-2">
                                {
                                    chat.length >0 && chat.map((item) => (
                                        <div>
                                            <ItemChat userChat={item} setRq={setIsDrawerOpen}></ItemChat>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div class="bg-white p-4 flex items-center">
                            <input type="text" value={contentChat} onChange={(e)=>{setContentChat(e.target.value)}} placeholder="Type your message..." class="flex-1 border rounded-full px-4 py-2 focus:outline-none" />
                            <button onClick={handleChat} class="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none">
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default ChatCourse;