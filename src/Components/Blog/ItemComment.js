import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { AuthContext } from "../../context/AuthContext";
import ItemRepComment from "./ItemRepComment";
import RequestUesr from "../ReportUser";
const editorConfiguration1 = {
    toolbar: {
        items: [
            'undo', 'redo',
            '|', 'heading',
            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
            'alignment',
            'link', 'uploadImage', 'blockQuote', 'codeBlock',
            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
        ],
        shouldNotGroupWhenFull: true
    }
};
function ItemComment(props) {
    const userComment = props.userComment;
    const idBlog=props.idBlog;
    const setRq=props.setRq;
    const [user, setUser] = useState(null);
    const [content,setContent]=useState("");
    const [commentSetting,setCommentSetting]=useState(false);
    const [timePost,setTimePost]=useState(null);
    const {currentUser}=useContext(AuthContext);

    useEffect(() => {
        const t = convertHtmlToString(userComment.content);
        setContent(t);

        const time = userComment.timePost.toDate();
        const day = time.getDate();
        const month = time.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        const year = time.getFullYear();
        const hours = time.getHours();
        const minutes = time.getMinutes();

        // Tạo chuỗi ngày tháng năm giờ phút
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        setTimePost(formattedDateTime);
        //console.log(userComment)
        const getUser = async () => {
            const docSnap = await getDoc(doc(db, "users", userComment.idUser));
            docSnap.exists && setUser(docSnap.data());
        }
        return () => {
            getUser();
        }
    }, [userComment])
    const convertHtmlToString = (htmlString) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        return tempDiv.textContent || tempDiv.innerText;
    };
    const toggleCommentSetting = () => {
        setCommentSetting(!commentSetting);
        //console.log(commentSetting);
    }
    const [dataReply,setDataReply]=useState("");
    const [reply,setReplly]=useState(false);
    const handleCheckReply=()=>{
        setReplly(true);
        setDataReply(`<a href="/" class="text-blue-600">@${user.displayName}</a>`);
    }
    const handleSubmitReply = async ()=>{
        const getBlog=await getDoc(doc(db,"blogs",idBlog));
        const timeRep=Timestamp.now();
        const reply1={idUser: currentUser.uid, content: dataReply,timeRep: timeRep}
        //const newData=[];
        if(getBlog.exists())
        {
            const blogData = getBlog.data();
            const comments = blogData.comment;
            console.log(userComment);
            const newData = comments.map(item => {
                if(item.reply!==undefined)
                {
                    const t1 = userComment.timePost.toDate().getTime();
                    const t2 = item.timePost.toDate().getTime();
                
                    // Kiểm tra xem item.reply có tồn tại và là một mảng không
                    let rl = Array.isArray(item.reply) ? item.reply : [];
                
                    if (item.content === userComment.content && item.idUser === userComment.idUser && t1 === t2) {
                        rl.push(reply1);
                    }
                
                    return { ...item, reply: rl };
                }
                else
                {
                    return item;
                }
            });
            //console.log(newData);
            await updateDoc(doc(db,"blogs",idBlog),{
                comment: newData
            })
            setDataReply("");
            setReplly(false);
        }
    }

    //Show rep comment
    const [showRep,setShowRep]=useState(false);
    const [showHideen,setShowHideen]=useState("Hiển thị");
    const handleShowRep= ()=>{
        setShowRep(!showRep);
        if(showRep===false)
        setShowHideen("Ẩn");
        else
        setShowHideen("Hiển thị");
    }
    return (
        user && userComment &&
        <div>
            <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                <footer class="flex justify-between items-center mb-2">
                    <div class="flex items-center">
                        <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                            class="mr-2 w-6 h-6 rounded-full"
                            src={user.photoURL}
                            alt={user.displayName} />{user.displayName}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {timePost}
                        </p>
                    </div>
                    <button onClick={toggleCommentSetting}  id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                        class="
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
                            <li>
                                <a href="/"
                                    class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                            <li>
                                <a href="/"
                                    class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                            </li>
                            <RequestUesr idReport={user.uid} nameUser={user.displayName} setRq={setRq}></RequestUesr>
                        </ul>
                    </div>
                    }
                </footer>
                <p class="text-gray-500 dark:text-gray-400">
                    {content}
                </p>
                <div class="flex items-center mt-4 space-x-4">
                    <button onClick={handleCheckReply} type="button"
                        class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                        <svg class="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                        </svg>
                        Reply
                    </button>
                    {
                        reply && 
                        <div>
                                <CKEditor
                                    editor={Editor}
                                    config={editorConfiguration1}
                                    data={dataReply}
                                    onReady={(editor) => {
                                        // You can store the "editor" and use when it is needed.
                                        console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const valuData = editor.getData();
                                        setDataReply(valuData);
                                    }}
                                    onBlur={(event, editor) => {
                                        console.log('Blur.', editor);
                                    }}
                                    onFocus={(event, editor) => {
                                        console.log('Focus.', editor);
                                    }}
                                />
                                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button type="button" onClick={handleSubmitReply} class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"> Bình luận </button>
                                        <button type="button" onClick={()=>{setReplly(false)}}  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"> Hủy </button>
                                    </div>
                            </div>
                    }
                </div>
                <div style={{marginTop: 10}}>
                    {
                        userComment.reply.length > 0 ?
                        <button style={{fontWeight: 'bold'}} onClick={handleShowRep}>{showHideen} {userComment.reply.length} câu trả lời</button> :
                        null
                    }
                </div>
            </article>
            {
                showRep && userComment.reply.length >0 &&
                userComment.reply.map((item,index)=>(
                    <ItemRepComment key={index} idBlog={idBlog} userComment1={item} userComment={userComment} />
                ))
            }
        </div>
    );
}

export default ItemComment;