import React, { useContext, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import '../../Page/test.css';
import { AuthContext } from "../../context/AuthContext";
import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
export default function LearingType4(props) {
    const { currentUser } = useContext(AuthContext);
    const active = props.active;
    const activeAll= props.activeAll;
    const idcourse =props.idcourse;
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [arrCheck,setArrCheck]=useState([]);
    const [checkNext,setCheckNext]=useState(false);
    const [success, setSuccess] = useState(false);
    const [final,setFinal]=useState(false);
    const navigate = useNavigate();
    const handleCloseSuccess = () => {
        setSuccess(false);
    }
    const updateFinal = async (idUser, currentActive) => {
        const ref = collection(db, "listCourseUser");
        const q1 = query(ref, where("IdUser", "==", idUser), where("IdCourse", "==", idcourse));
        const docCheck = await getDocs(q1);
        if (!docCheck.empty) {
            const fl = (currentActive + 1) / activeAll.length * 100;
            try {
                await updateDoc(doc(db, "listCourseUser", docCheck.docs[0].data().id), {
                    final: fl
                })
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log(false);
        }
    }
    const handleSubmit= async ()=>{
        const currentActive = activeAll.findIndex(ob => ob.id === active.id);
        let nextActive = -1;
        if (currentActive !== -1)
            nextActive = currentActive === activeAll.length - 1 ? activeAll[currentActive] : activeAll[currentActive + 1];
        else {
            window.location.reload();
        }

        const docUser = await getDoc(doc(db, "users", currentUser.uid));
        const idUser = docUser.data().id;
        const q = query(collection(db, "detailActive"), where("IdActive", "==", active.id), where("IdUser", "==", idUser));
        const docCheck = await getDocs(q);
        //Kiểm tra xem người dùng đã có trong bảng deailActive hay chưa nếu chưa thì thêm vào còn nếu có rồi thì chuyển trạng thái bằng true
        if (docCheck.empty) {
            let id = uuid();
            try {
                const time = Timestamp.now();
                await setDoc(doc(db, "detailActive", id), {
                    id: id,
                    IdUser: idUser,
                    IdActive: active.id,
                    pass: true,
                    timeUpdate: time
                });
                updateFinal(idUser, currentActive);
                if (currentActive === activeAll.length - 1) {
                    const timeComple = Timestamp.now();
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        courseComplete: arrayUnion({ idcourse: idcourse, time: timeComple })
                    });
                }
                setSuccess(true);
                const timeoutId = setTimeout(() => {
                    setSuccess(false);
                    //Kiểm tra xem người dùng đã end khóa học hay chưa
                    if (currentActive === activeAll.length - 1) {
                        navigate(`/Course/CompleCourse/${idcourse}`);
                    }
                    else {
                        navigate(`/learing/${nextActive.id}/${idcourse}`);
                        window.location.reload();
                    }
                }, 3000);
                console.log(timeoutId);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            const idDetail = docCheck.docs[0].data().id;
            if (docCheck.docs[0].data().pass === false) {
                const time = Timestamp.now();
                await updateDoc(doc(db, "detailActive", idDetail), {
                    timeUpdate: time,
                    pass: true
                });
                if (currentActive === activeAll.length - 1) {
                    const timeComple = Timestamp.now();
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        courseComplete: arrayUnion({ idcourse: idcourse, time: timeComple })
                    });
                }
                updateFinal(idUser, currentActive);
                setSuccess(true);
                const timeoutId = setTimeout(() => {
                    setSuccess(false);
                    if (currentActive === activeAll.length - 1) {
                        navigate(`/Course/CompleCourse/${idcourse}`);
                    }
                    else {
                        navigate(`/learing/${nextActive.id}/${idcourse}`);
                        window.location.reload();
                    }
                }, 3000);
                console.log(timeoutId);
            }
        }
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        const dt=Array.from({length: numPages});
        setArrCheck(dt);
    }
    const handlePre = () => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    }
    const handleNext = () => {
        const index= Math.min(pageNumber + 1, numPages);
        if(arrCheck[index]===undefined)
        {
            arrCheck[index]=true;
            setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
            setCheckNext(false);
            setTimeout(()=>{
                if(index===numPages)
                setFinal(true);
                else
                setCheckNext(true);

            },10000)
        }
        else
        {
            setCheckNext(true);
            setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
        }
    }
    useEffect(()=>{
        setTimeout(()=>{
            setCheckNext(true);
        },3000)
    },[])
    return (
        <div style={{ flex: 0.70, height: 600, padding: 30 }}>
            <div className="pdf-div">
                <Document file={active.fileURL} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </div>

            <div class="mt-6 sm:flex sm:items-center sm:justify-between ">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    Trang <span class="font-medium text-gray-700 dark:text-gray-100">{pageNumber} of {numPages}</span>
                </div>
                <div class="flex items-center mt-4 gap-x-4 sm:mt-0">
                    <button onClick={handlePre} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                        </svg>

                        <span>
                            previous
                        </span>
                    </button>
                    {
                        checkNext &&
                        <button onClick={handleNext} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                            <span>
                                Next
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    }
                    {
                        final &&
                        <button onClick={handleSubmit} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-green-500 border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                            <span>
                                Hoàn thành
                            </span>
                        </button>
                    }
                </div>
            </div>
            <div
                class={`font-regular ${success === true ? 'block' : 'hidden'} w-full max-w-screen-md rounded-lg bg-green-500 px-4 py-4 text-base text-white fixed bottom-2 right-2`}
                data-dismissible="alert"
            >
                <div class="absolute top-4 left-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="mt-px h-6 w-6"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                <div class="ml-8 mr-12">
                    <h5 class="block font-sans text-xl font-semibold leading-snug tracking-normal text-white antialiased">
                        Success
                    </h5>
                    <p class="mt-2 block font-sans text-base font-normal leading-relaxed text-white antialiased">
                        Chúc mừng bạn đã hoàn thành hoạt động của khóa học. Hãy tiếp tục cố gắng nhé !
                    </p>
                </div>
                <div
                    data-dismissible-target="alert"
                    data-ripple-dark="true"
                    class="absolute top-3 right-3 w-max rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                >
                    <div role="button" onClick={handleCloseSuccess} class="w-max rounded-lg p-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
