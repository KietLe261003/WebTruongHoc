import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Timestamp, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { doc } from "firebase/firestore";
import {v4 as uuid} from 'uuid';

import Messages from "./Messages";
function Chat() {

    const [text,setText] = useState("");
    const [img,setImg] = useState(null);

    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    useEffect(() => {
        scrollToBottom();
    }, []); // Chỉ gọi một lần sau khi component được render

    function scrollToBottom() {
        var container = document.getElementById("body-message");
        container.scrollTop = container.scrollHeight;
    }
    const handleSend = async ()=>{
        if(img)
        {
            console.log("haha");
        }
        else{
            //console.log(data);
            await updateDoc(doc(db,"chats",data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text: text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            });
        }
        setText("");
        setImg(null);
    }
    return (
        <div class="flex-1 h-full">
            <Messages/>
            <div class="bg-white border-t border-gray-300 p-4 absolute bottom-2 w-[85%]">
                <div class="flex items-center">
                    <input type="text" 
                    placeholder="Type a message..." 
                    class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500" 
                    onChange={(e) =>setText(e.target.value)}
                    value={text}
                    />
                    <button class="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>);
}

export default Chat;