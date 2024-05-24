import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import RequestUesr from "../ReportUser";

function ItemChat(props) {
    const {currentUser}=useContext(AuthContext);
    const userChat = props.userChat;
    const [user,setUser]=useState(null);
    const setRq=props.setRq;
    useEffect(()=>{
        const getUser = async ()=>{
            const user1 = await getDoc(doc(db, "users", userChat.idUser));
            user1.exists() && setUser(user1.data());
        }
        return ()=>{
            getUser();
        }
    },[userChat]);
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return formattedDate;
    }
    const [commentSetting,setCommentSetting]=useState(false);
    const toggleCommentSetting = () => {
        setCommentSetting(!commentSetting);
        //console.log(commentSetting);
    }
    return ( 
        user!=null && (userChat.idUser !== currentUser.uid ? 
            <div class="flex">
                <img
                    class="mr-2 w-9 h-9 rounded-full"
                    src={user.photoURL}
                    alt="Hình ảnh" />
                <div class="bg-gray-300 text-black p-2 rounded-lg max-w-xs">
                    <p class="flex flex-row justify-start mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        {user.displayName}
                    </p>
                    <p>
                        {userChat.content}
                    </p>
                    <span class="flex flex-row justify-start" style={{fontSize: 12}}>{formatTimestamp(userChat.timeChat)}</span>
                    <div class="flex flex-row justify-start">
                        <button onClick={toggleCommentSetting} id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                            class=" max-h-3
                        inline-flex
                        items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                            </svg>
                            <span class="sr-only">Comment settings</span>
                        </button>
                        {/* <!-- Dropdown menu --> */}
                        {
                            commentSetting &&
                            <div id="dropdownComment1"
                                class="z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownMenuIconHorizontalButton">
                                    <RequestUesr idReport={user.uid} nameUser={user.displayName} setRq={setRq}></RequestUesr>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div> :
            <div class="flex justify-end">  
                <div class="bg-blue-200 text-black p-2 rounded-lg max-w-xs flex flex-col">
                    <p class="flex flex-row justify-end mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        {user.displayName}
                    </p>
                    <p>
                        {userChat.content}
                    </p>
                    <span class="flex flex-row justify-end" style={{fontSize: 12}}>{formatTimestamp(userChat.timeChat)}</span>
                    <div class="flex flex-row justify-end">
                        <button onClick={toggleCommentSetting} id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                            class=" max-h-3
                        inline-flex
                        items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                            </svg>
                            <span class="sr-only">Comment settings</span>
                        </button>
                        {/* <!-- Dropdown menu --> */}
                        {
                            commentSetting &&
                            <div id="dropdownComment1"
                                class="z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownMenuIconHorizontalButton">
                                    <RequestUesr idReport={user.uid} nameUser={user.displayName} setRq={setRq}></RequestUesr>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
                <img
                    class="mr-2 w-9 h-9 rounded-full"
                    src={user.photoURL}
                    alt="Hình ảnh" />
            </div>)
     );
}

export default ItemChat;