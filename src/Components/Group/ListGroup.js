import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {db} from '../../../src/firebase';
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import {ChatContext} from "../../context/ChatContext"
import GroupItem from "./GroupItem";
import HeaderGroup from "./HeaderGroup";

function ListGroup() {
    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const [chats,setChats] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        const getChat = ()=>{
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
             });
     
             return ()=>{
                 unsub();
             }
        }
        currentUser.uid && getChat();
    },[currentUser.uid]);
    console.log(Object.entries(chats));
    const handleSelect = (u)=>{
        dispatch({type: "CHANGE_USER",payload: u});
        navigate("/Class");
    }

    return (<div class="bg-gray flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row sm:p-6 sm:my-2  sm:rounded-2xl w-full">
        <div class="flex-1 px-2 sm:px-0">
            <HeaderGroup></HeaderGroup>
            <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div class="group bg-gray-900/30 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover">
                    <a class="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </a>
                    <a class="text-white/50 group-hover:text-white group-hover:smooth-hover text-center" href="/">Create group</a>
                </div>
                {
                    Object.entries(chats)?.map((chat) => (
                        <div onClick={()=>handleSelect(chat[1].userInfo)}>
                            <GroupItem 
                                name={chat[1].userInfo.displayName} 
                                photoURL={chat[1].userInfo.photoURL}
                                />
                        </div>
                    ))
                }
            </div>
        </div>
    </div>);
}

export default ListGroup;