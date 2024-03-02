import React,  { useContext, useState } from 'react';
import ManagerClass from '../../Components/Class/NavigateChat';
import './Class.css';
import {db} from '../../../src/firebase';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp,getDoc } from 'firebase/firestore';
import {AuthContext} from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
function Class() {
    const [userName,setUserName]= useState("");
    const [user,setUser]=useState(null);
    const [err,setErr]= useState(false);

    const {currentUser} = useContext(AuthContext);
    const handleSearch = async ()=>{
        const q = query(collection(db,"users"),where("displayName","==",userName));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
                console.log(doc.data());
            });
        } catch {
            setErr(true);
        }
    }
    const handleKey = e=>{
        e.code === "Enter" && handleSearch(); 
    }
    const handlSelect = async ()=>{
        //kiểm tra xem 2 người dùng đã nhắn tin với nhau chưa nếu chưa thì tạo 1 đoạn tin nhắn mới
        const combinedId= currentUser.uid > user.uid 
                            ? currentUser.uid+user.uid 
                            : user.uid+currentUser.uid; 
    
        try {
            const res = await getDoc(doc(db,"chats",combinedId));
            if(!res.exists())
            {   
                //Tạo đoạn chat
                await setDoc(doc(db,"chats",combinedId),{
                    messages: []
                });

                //Tạo thông tin người chat
                await updateDoc(doc(db,"userChats",currentUser.uid),{
                    [combinedId+".userInfo"]:{
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId+".date"]: serverTimestamp(),
                })
                await updateDoc(doc(db,"userChats",user.uid),{
                    [combinedId+".userInfo"]:{
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId+".date"]: serverTimestamp(),
                })
            }
        } catch (error) {
            setErr(true);
        }
        //Tạo tin nhắn mới
    }
    return ( <div>
        <div class="relative w-full">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z" />
                </svg>
            </div>
            <input type="text" id="voice-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos, Design Templates..." required
                onChange={e => { setUserName(e.target.value) }} onKeyDown={handleKey}
            />
            <button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3" onClick={handleSearch}>
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                    <FontAwesomeIcon icon={faSearchengin}></FontAwesomeIcon>
                </svg>
            </button>
        </div>  
        {err && <span>User not found</span>}
        {user &&
            <div class="flex items-center mr-auto" style={{ margin: 25 }} onClick={handlSelect}>
                <div class="inline-flex w-12 h-12">
                    <img src={user.photoURL} alt="aji" class=" relative w-12 h-12 object-cover rounded-2xl" />
                    <span></span>
                </div>
                <div class="flex flex-col ml-3">
                    <div class="font-medium leading-none text-black-500">{user.displayName}</div>
                </div>
            </div>
        }
        <ManagerClass/>
    </div> );
}

export default Class;