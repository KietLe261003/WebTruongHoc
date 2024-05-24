import { Timestamp, arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import './Blog.css';
import { AuthContext } from "../../context/AuthContext";
import ItemComment from "../../../src/Components/Blog/ItemComment";
const editorConfiguration = {
    toolbar: {
        items: [
        ],
        shouldNotGroupWhenFull: true
    },
    contentsCss: ["./Blog.css"],
};

function DetailBlog() {
    const { idBlog } = useParams();
    const [blog, setBlog] = useState(null);
    const {currentUser}=useContext(AuthContext);
    //Show comment
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [comment,setComment]=useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        setShowOverlay(!showOverlay);
    };
    useEffect(() => {
        const checkLikeed = async () => {
            const docRef = doc(db, "users",currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                //console.log("Document data:", docSnap.data());
                const us=docSnap.data().likeBlog;
                if(us!==undefined)
                {
                    const lk=us.find(item=> item===idBlog);
                    console.log(lk);
                    if(lk!==undefined)
                    setCheckLike(true);
                    else
                    setCheckLike(false);
                }
            } else {
                console.log("No such document!");
            }
        }
        const getBlog = onSnapshot(doc(db,"blogs",idBlog),(item)=>{
            if(item.exists())
            {
                setBlog(item.data());
            }
        });
        const unSub= onSnapshot(doc(db,"blogs",idBlog),(item)=>{
            if(item.exists())
            {
                const tmp =item.data().comment;
                tmp.sort((a,b)=>b.timePost - a.timePost)
                setComment(tmp);
            }
        });
        checkLikeed();
        return () => {
            getBlog();
            unSub();
        }
    }, [idBlog,currentUser])
    const [inserted, setInserted] = useState(false);
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
    const [userComment, setUserComment] = useState("");
    //console.log(inserted);
    const handleComment = async ()=>{
        try {
            const timeUp=Timestamp.now();
            await updateDoc(doc(db,"blogs",blog.id),{
                comment: arrayUnion({
                    idUser: currentUser.uid,
                    content: userComment,
                    timePost: timeUp,
                    reply: []
                })
            })
            setInserted(false);
            setUserComment("");
        } catch (error) {
            alert("Lỗi");
        }
    }
    const [checkLike,setCheckLike]=useState(false);
    const handleLike= async ()=>{
        try {
            if(checkLike===false)
            {  
                await updateDoc(doc(db,"users",currentUser.uid),{
                    likeBlog: arrayUnion(idBlog)
                })
                setCheckLike(true);
                const likeblog=blog.like+1;
                await updateDoc(doc(db,"blogs",idBlog),{
                    like: likeblog
                })
            }
            else
            {
                await updateDoc(doc(db,"users",currentUser.uid),{
                    likeBlog: arrayRemove(idBlog)
                })
                setCheckLike(false);
                const likeblog=blog.like-1;
                await updateDoc(doc(db,"blogs",idBlog),{
                    like: likeblog
                })
            }
        } catch (error) {
            console.log("Lỗi xử lý");
        } 
    }
    return (
        blog &&
        <div>
            <div class="flex min-h-screen flex-row bg-gray-100 text-gray-80">
                <aside class="sidebar w-60 -translate-x-full transform bg-white p-4 transition-transform duration-150 ease-in md:translate-x-0 md:shadow-md">
                    <div class="my-4 w-full border-b-4 border-indigo-100 text-center">
                        <span class="font-mono text-xl font-bold tracking-widest"> <span class="text-indigo-600">HELLO</span> DEV </span>
                    </div>
                    <div class="my-4">
                        <div class="flex flex-col justify-between text-gray-500">
                            <div class="flex items-center space-x-2">
                                <button onClick={handleLike} class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
                                    <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        {
                                            checkLike===true ? 
                                            <path fill="red" d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
                                            :
                                            <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
                                        }

                                    </svg>
                                    <span>{blog.like} Likes</span>
                                </button>
                            </div>
                            <button onClick={toggleDrawer} class="flex items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
                                <svg width="22px" height="22px" viewBox="0 0 24 24" class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"></path>
                                    </g>
                                </svg>
                                <span>{blog.comment.length} Comment</span>
                            </button>
                        </div>
                    </div>
                </aside>
                <main class="main -ml-48 flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
                    <div class="flex h-full bg-white shadow-md">
                        <CKEditor
                            class="w-full border-none rounded-none z-1"
                            editor={Editor}
                            config={editorConfiguration}
                            data={blog.content}
                            onReady={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                //console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {

                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                            disabled
                        />
                    </div>
                </main>
            </div>
            <div style={{ width: '50%', zIndex: 50 }} className={`fixed top-0 right-0 z-100 h-full transition-all duration-500 transform ${isDrawerOpen ? '' : 'translate-x-full'} bg-white shadow-lg`}>
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
                        <p style={{ fontSize: 25, fontWeight: "bold", color: 'black' }}>Comment</p>
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
                <div class="p-4">
                    {
                        inserted === false ? 
                        <input 
                        onFocus={()=>{setInserted(true)}}
                        typeof="text"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" placeholder="Viết bình luận của bạn"/>
                        :
                        <div>
                            <CKEditor
                                editor={Editor}
                                config={editorConfiguration1}
                                data={userComment}
                                onReady={(editor) => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const valuData = editor.getData();
                                    setUserComment(valuData);
                                }}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="button" onClick={handleComment} class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"> Bình luận </button>
                                    <button type="button" onClick={()=>{setInserted(false)}} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"> Hủy </button>
                                </div>
                        </div>
                    }
                </div>
                <ul class="flex flex-col p-2 rounde-lg" style={{overflowY: 'auto',maxHeight: '650px', marginBottom: 20}} aria-labelledby="dropdownDefaultButton">
                    {
                        comment.length>0 && comment.map((item,index)=>(
                            <li>
                                <ItemComment key={index} idBlog={idBlog} userComment={item} setRq={setIsDrawerOpen}/>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default DetailBlog;