import React from "react";
import './learing.css';
import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Modal from 'react-modal';
import { v4 as uuid } from "uuid";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px'
    },
};

function LearingType5(props) {
    const { currentUser } = useContext(AuthContext);
    const active = props.active;
    const activeAll= props.activeAll;
    const idcourse =props.idcourse;
    const [point,setPoint]=useState(0);
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [success, setSuccess] = useState(false);
    const handleCloseSuccess = () => {
        setSuccess(false);
    }
    const [isOpen,setIsOpen]=useState(false);
    const closeModal = ()=>{
        setIsOpen(false);
    }
    function randomOrder() {
        return Math.random() - 0.5; // Trả về một số ngẫu nhiên âm hoặc dương
      }
    useEffect(()=>{
        const randomQuestion = ()=>{
            const tmp= active.listQuestion.sort(randomOrder);
            setQuestions(tmp)
        }
        return ()=>{
            randomQuestion();
        }
    },[active])
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
                    timeUpdate: time,
                    point: point
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
    const hanndleChoice = (choice,index)=>{
        questions[index].choiceUser=choice;
    }
    const handleCheckSubmit = ()=>{
        let sumPoint = 0;
        questions.forEach((item)=>{
            if(item.ans===item.choiceUser)
            sumPoint++;
        })
        sumPoint=sumPoint/questions.length*10;
        if(sumPoint<5)
        {
            const tmp= active.listQuestion.sort(randomOrder);
            setQuestions(tmp)
        }
        setPoint(sumPoint);
        setIsOpen(true);
    }
    const [checkAns,setCheckAns]=useState(false);
    const closeAns=()=>{
        setCheckAns(false);
    }
    return (
        <div style={{ flex: 0.70, height: 600 , padding: 20, color: 'white'}}>
             <div class="ml-auto mr-sm-5 float-right"  style={{ position: "fixed", zIndex: 2, right: "10px", bottom: "10px" }}>
                <button class="btn btn-success float-end" onClick={()=>{setCheckAns(true)}}>Xem đáp án</button>
            </div>
            {
                questions.map((item,index)=>(
                    <div key={index} class="container mt-sm-5 my-1 bg-gray-600 p-5" style={{ borderRadius: 10 }}>
                        <div class="question ml-sm-5 pl-sm-5 pt-2">
                            <div class="py-2 h5"><b>{item.question}</b></div>
                            <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
                                <label class="options">{item.option1}
                                    <input type="radio" onChange={(e)=>{hanndleChoice(e.target.value,index)}} value={item.option1} name={`radio${index}`} />
                                    <span class="checkmark"></span>
                                </label>
                                <label class="options">{item.option2}
                                    <input type="radio" onChange={(e)=>{hanndleChoice(e.target.value,index)}} value={item.option2} name={`radio${index}`} />
                                    <span class="checkmark"></span>
                                </label>
                                <label class="options">{item.option3}
                                    <input type="radio" onChange={(e)=>{hanndleChoice(e.target.value,index)}} value={item.option3} name={`radio${index}`} />
                                    <span class="checkmark"></span>
                                </label>
                                <label class="options">{item.option4}
                                    <input type="radio" onChange={(e)=>{hanndleChoice(e.target.value,index)}} value={item.option4} name={`radio${index}`} />
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                ))
            }
           
            <div class="d-flex align-items-center pt-3">
                {
                    point>0 && 
                    <div id="prev">
                        <button class="btn btn-primary" onClick={()=>{setIsOpen(true)}}>Xem điểm</button>
                    </div>
                }
                <div class="ml-auto mr-sm-5">
                    <button class="btn btn-success" onClick={handleCheckSubmit}>Nộp bài</button>
                </div>
                {
                    point > 5 &&
                    <div class="ml-auto mr-sm-5">
                        <button class="btn btn-success" onClick={handleSubmit}>Hoàn thành hoạt động</button>
                    </div>
                }
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
            <Modal
                isOpen={checkAns}
                onRequestClose={closeAns}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div class="bg-blue-400" style={{
                    height: "80px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 20, fontWeight: "bold" }}>Đáp án</p>
                    </div>
                    <div style={{ flex: "0.5",display: "flex", flexDirection: "row-reverse", margin: 15, overflowY: "auto" }} >
                        <button type="button" onClick={closeAns} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div style={{ padding: "20px",maxWidth: "1000px", maxHeight: "500px", }}>
                    {
                        questions.map((item) => (
                            <div>
                                <label class="options">{item.question}
                                </label>
                                <label class="options">{item.ans}
                                </label>
                            </div>
                        ))
                    }
                </div>
            </Modal>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div class="bg-blue-400" style={{
                    height: "80px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 20, fontWeight: "bold" }}>Điểm của bạn là</p>
                    </div>
                    <div style={{ flex: "0.5",display: "flex", flexDirection: "row-reverse", margin: 15, overflowY: "auto", }} >
                        <button type="button" onClick={closeModal} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div style={{ padding: "20px",maxWidth: "1000px", maxHeight: "500px", }}>
                    <p style={{textAlign: 'center',fontSize: 20, fontWeight: 'bold', color: 'red'}}>{point}</p>
                    <h1>Số câu sai</h1>
                        {
                            questions.map((item) => (
                                <div>
                                    {
                                        (item.choiceUser!==item.ans || item.choiceUser===undefined) &&
                                        <div style={{display: 'flex',flexDirection: 'column'}}>
                                            <label class="options">{item.question}
                                            </label>
                                            <div>
                                                <label class="options bg-green-500">Đáp án đúng: {item.ans}</label>
                                                <label class="options bg-red-500">Đáp án của bạn: {item.choiceUser}</label>
                                            </div>
                                            <div style={{height: 5, width: '100%', backgroundColor: 'black', marginBottom: 20}}></div>
                                        </div>
                                    }
                                </div>
                            ))
                        }
                </div>
            </Modal>
        </div>
    );
}

export default LearingType5;


