import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

function Message({message}) {
    const {currentUser}=useContext(AuthContext);
    const { data } = useContext(ChatContext);
    console.log(message.senderId);
    return (
        <div>
            {
                currentUser.uid===message.senderId
                ? 
                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>{message.text}</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src={currentUser.photoURL} alt="My Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                </div>
                :  
                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src={data.user.photoURL} alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p>{message.text}</p>
                    </div>
                </div>
            }
        </div>
    );
}

export default Message;