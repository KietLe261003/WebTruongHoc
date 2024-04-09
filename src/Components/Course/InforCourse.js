import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Paymentbtn from './PaymentBtn';
function InforCourse(props) {
    const { currentUser } = useContext(AuthContext);
    const course = props.course;
    const idRoadMap = props.idRoadMap;
    const [checkApply, setCheckApply] = useState(null);
    const navigate = useNavigate();
    let price = "";
    price = price + course.priceCourse;
    const rating = Array.from({ length: 5 });
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
            <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Đánh giá</p>
                <div class="flex items-center justify-center">
                    <div class="flex items-center">
                        {
                            rating.map((it, index) => (
                                index + 1 <= course.rating ?
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
            </div>
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

        </div>
    );
}

export default InforCourse;