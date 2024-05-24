import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Paymentbtn from './PaymentBtn';
import ChatCourse from "./ChatCourse";
function InforCourse(props) {
    const { currentUser } = useContext(AuthContext);
    const course = props.course;
    const idRoadMap = props.idRoadMap;
    const [checkApply, setCheckApply] = useState(null);
    const navigate = useNavigate();
    let price = "";
    price = price + course.priceCourse;
    const rating = Array.from({ length: 5 });
    const [comment,setComment]=useState(course.comment!==undefined ? course.comment.length > 0 ? course.comment : [] : []);
    useEffect(()=>{
        const dt=[];
        course.comment.map((item,index)=>{
            const getUser = async ()=>{
                const snap = await getDoc(doc(db,"users",item.IdUser));
                if(snap.exists())
                {
                    const tmp ={
                        content: item.content,
                        nameUser: snap.data().displayName,
                        avt: snap.data().photoURL,
                        start: item.start
                    }
                    dt.push(tmp);
                }
                else{
                    const tmp ={
                        content: item.content,
                        nameUser: "Ẩn danh",
                        avt: "https://firebasestorage.googleapis.com/v0/b/testdata-1f2fb.appspot.com/o/teacher11708406978178?alt=media&token=38714eb2-a3cd-4143-8c34-dd17fcdbb965",
                        start: item.start
                    }
                    dt.push(tmp);
                }
                console.log("Hahah");
            }
            return getUser();
        })
        setComment(dt);
    },[course.comment])
    useEffect(() => {
        const getUser = async () => {
            const docSnap = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docSnap.data().id;
            const ref = collection(db, "listCourseUser");
            const q1 = query(ref, where("IdUser", "==", idUser), where("IdCourse", "==", course.id));
            const docCheck = await getDocs(q1);
            if (!docCheck.empty) {
                setCheckApply(true);
            }
            else {
                setCheckApply(false);
            }
        }
        return () => {
            getUser();
        }
    }, [currentUser, course.id])
    const handleApply = async () => {
        if (checkApply === true) {
            const dt = [];
            const q = query(collection(db, "active"), where("idRoadMap", "==", idRoadMap));
            const rm = await getDocs(q);
            rm.forEach((it) => {
                dt.push(it.data());
            })
            dt.sort((a,b)=> a.timeCreate-b.timeCreate);
            if(dt.length<=0)
            {
                alert("Khóa học chưa có hoạt động");
            }
            else
            {
                const idActive = dt[0].id;
                navigate(`/learing/${idActive}/${course.id}`);
            }
        }
        else {
            
            const docSnap = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docSnap.data().id;
            const docListCourseUser = await getDocs(collection(db, "listCourseUser"));
            const sz = docListCourseUser.size + 1;
            const id = "" + sz;
            try {
                await setDoc(doc(db, "listCourseUser", id), {
                    id: id,
                    IdUser: idUser,
                    IdCourse: course.id,
                    final: 0
                });
                const numberUser = course.userAplly===undefined ? 1 : course.userAplly+1;
                await updateDoc(doc(db,"course",course.id),{
                    userAplly: numberUser
                })
                console.log("Document successfully written!");
            } catch (e) {
                console.error("Error writing document: ", e);
            }
            const dt = [];
            const q = query(collection(db, "active"), where("idRoadMap", "==", idRoadMap));
            const rm = await getDocs(q);
            await Promise.all(rm.docs.map(async (it) => {
                dt.push(it.data());    
            }));
            dt.sort((a,b)=> a.timeCreate-b.timeCreate);
            if(dt.length<=0)
            {
                alert("Khóa học chưa có hoạt động");
            }
            else
            {
                const idActive = dt[0].id;
                navigate(`/learing/${idActive}/${course.id}`);
            }
        }
    }
    const buttonApply = () => {
        if (checkApply === true) {
            return <button
                onClick={handleApply}
                className="dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-green-500 w-full py-4 focus:outline-none"
            >
                Tiếp tục học
            </button>
        }
        else {
            return <div>
                {
                    course.priceCourse!==0 ?
                    <div>
                        <button disabled class="dark:bg-white mb-3 dark:text-gray-900 dark:hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                            {price + " VNĐ"}
                        </button>
                        <Paymentbtn course={course} idRoadMap={idRoadMap} price={price}></Paymentbtn>
                    </div> :
                    <div>
                        <button onClick={handleApply} class="dark:bg-white mb-3 dark:text-gray-900 dark:hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                            Đăng ký học
                        </button>
                    </div> 
                }
            </div>
        }
    }
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        setShowOverlay(!showOverlay);
    };
    return (
        <div class="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
            <div class="border-b border-gray-200 pb-6">
                {
                    course &&
                    <h1 class="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">
                        {course.nameCourse}
                    </h1>
                }
            </div>
            <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Thời gian cập nhật</p>
                <div class="flex items-center justify-center">
                    <p class="text-sm leading-none text-gray-600 dark:text-gray-300">{course && course.teacher}</p>
                </div>
            </div>
            <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Chuyên môn</p>
                <div class="flex items-center justify-center">
                    <p class="text-sm leading-none text-gray-600 dark:text-gray-300">Cơ bản</p>
                </div>
            </div>
            <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Tổng số bài giảng</p>
                <div class="flex items-center justify-center">
                    <p class="text-sm leading-none text-gray-600 dark:text-gray-300">{course && course.sumActive}</p>
                </div>
            </div>
            <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Số giờ học</p>
                <div class="flex items-center justify-center">
                    <p class="text-sm leading-none text-gray-600 dark:text-gray-300">Cơ bản</p>
                </div>
            </div>
            <button onClick={toggleDrawer} class="py-4 border-b w-full border-gray-200 flex flex-row items-center justify-between hover:bg-slate-400">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Đánh giá</p>
                <div class="flex items-center justify-center">
                    <div class="flex items-center">
                        {
                            rating.length >0 && rating.map((it, index) => (
                                index + 1 <= course.rating/course.comment.length ?
                                    <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                        </path>
                                    </svg>
                                    :
                                    <svg class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                        </path>
                                    </svg>
                            ))
                        }
                    </div>
                </div>
            </button>
            {
                checkApply===true &&
                <ChatCourse course={course}></ChatCourse>
            }
            {
                checkApply !== null && buttonApply()
            }
            <div style={{ marginTop: 30 }}>
                <p style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>Mô tả khóa học</p>
                <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                    <textarea id="editor" value={course.description} disabled rows={"9"} class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder=""
                        style={{ resize: 'none' }}>
                    </textarea>
                </div>
            </div>
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
                <ul class="flex flex-col p-2 rounde-lg" style={{overflowY: 'auto',maxHeight: '650px', marginBottom: 20}} aria-labelledby="dropdownDefaultButton">
                    {
                        comment.length>0 && comment.map((item,index)=>(
                            <li>
                                <div>
                                    <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                                        <footer class="flex justify-between items-center mb-2">
                                            <div class="flex items-center">
                                                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                <img
                                                    class="mr-2 w-6 h-6 rounded-full"
                                                    src={item.avt}
                                                    alt="Hình ảnh" />{item.nameUser}</p>
                                                {/* <p class="text-sm text-gray-600 dark:text-gray-400">
                                                    {timePost}
                                                </p> */}
                                            </div>
                                        </footer>
                                        <p class="text-gray-500 dark:text-gray-400">
                                            {item.content}
                                        </p>
                                    </article>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default InforCourse;