import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import RoadMapUser from "../Course/RoadMapUser";
import Header from "./Header";
import { red } from "@mui/material/colors";
import { AuthContext } from "../../context/AuthContext";
import moment from 'moment';
import LearingType2 from "./LearingType2";
import LearingType3 from "./LearingType3";
import LearingType4 from "./LearingType4";
import LearingType5 from "./LearingType5";
import { v4 as uuid } from "uuid";
function Learing() {
    const { currentUser } = useContext(AuthContext);
    const { idActive, idcourse } = useParams();
    const videoRef = useRef(null);
    const navigate = useNavigate();
    //const [videoDuration, setVideoDuration] = useState(null);
    const [active, setActive] = useState(null);
    const [roadMap, setRoadMap] = useState([]);
    const [course, setCourse] = useState(null);
    const [err, setErr] = useState(false);
    const [sumActive, setSumActive] = useState(0);
    const [success, setSuccess] = useState(false);
    const [activeAll, setActiveAll] = useState([]);
    const [checkPass, setCheckPass] = useState(null);
    const [indexActive, setIndexActive] = useState(0);
    const [time, setTime] = useState(0);
    const handleLoadedMetadata = () => {
        // Lấy thời lượng video và cập nhật state
        //const duration = videoRef.current.duration;
        //setVideoDuration(duration);
        //console.log(videoDuration);
    };

    useEffect(() => {
        const getChekPass = async () => {
            if (currentUser.uid != null) {
                const docUser = await getDoc(doc(db, "users", currentUser.uid));
                const idUser = docUser.data().id;
                const q = query(collection(db, "detailActive"), where("IdActive", "==", idActive), where("IdUser", "==", idUser));
                const docCheck = await getDocs(q);
                if (!docCheck.empty)
                    setCheckPass(docCheck.docs[0].pass);
                else
                    setCheckPass(false);
            }
        }
        const getCourse = async () => {
            const docSnap = await getDoc(doc(db, "course", idcourse));
            if (docSnap.exists) {
                setCourse(docSnap.data());
            }
            else
                setErr(true);
        }
        const getActive = async () => {
            const docSnap = await getDoc(doc(db, "active", idActive));
            if (docSnap.exists) {
                setActive(docSnap.data());
                //console.log(docSnap.data().timeUpdate);
            }
            else
                setErr(true);
        }
        const getRoadMap = async () => {
            const rm = [];
            const ac = [];
            const q = query(collection(db, "courseRoadMap"), where("IdCourse", "==", idcourse));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                rm.push(doc.data());
                const activeQ = query(collection(db, "active"), where("idRoadMap", "==", doc.data().IdRoadMap));
                const getActive = await getDocs(activeQ);
                const ac1 = [];
                getActive.forEach((it) => {
                    if (it.data().id === idActive)
                        setIndexActive(ac.length + 1);
                    ac1.push(it);
                })
                ac1.sort((a, b) => {
                    const timeA = a.data().timeCreate;
                    const timeB = b.data().timeCreate;
                    if (timeA.seconds < timeB.seconds) {
                        return -1;
                    } else if (timeA.seconds > timeB.seconds) {
                        return 1;
                    } else {
                        return timeA.nanoseconds - timeB.nanoseconds;
                    }
                });
                ac1.forEach((i) => {
                    ac.push(i);
                })
            });
            rm.sort((a,b)=>a.timeCreate-b.timeCreate);
            rm.forEach((it) => {
                loadSumActive(it.IdRoadMap);
            })
            setActiveAll(ac);
            setRoadMap(rm);
        }
        return () => {
            getActive();
            getRoadMap();
            getCourse();
            getChekPass();
        }
    }, [idActive, idcourse, currentUser])
    const loadSumActive = async (id) => {
        const q = query(collection(db, "active"), where("idRoadMap", "==", id));
        const docSnap = await getDocs(q);
        setSumActive((prevSumActive) => prevSumActive + docSnap.size);
    }
    const updateFinal = async (idUser, currentActive) => {
        const ref = collection(db, "listCourseUser");
        const q1 = query(ref, where("IdUser", "==", idUser), where("IdCourse", "==", course.id));
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
    //Khi kết thúc video
    const handleEndVideo = async () => {
        const currentActive = activeAll.findIndex(ob => ob.id === idActive);
        let nextActive = -1;
        if (currentActive !== -1)
            nextActive = currentActive === activeAll.length - 1 ? activeAll[currentActive] : activeAll[currentActive + 1];
        else {
            window.location.reload();
        }

        const docUser = await getDoc(doc(db, "users", currentUser.uid));
        const idUser = docUser.data().id;
        const q = query(collection(db, "detailActive"), where("IdActive", "==", idActive), where("IdUser", "==", idUser));
        const docCheck = await getDocs(q);
        //Kiểm tra xem người dùng đã có trong bảng deailActive hay chưa nếu chưa thì thêm vào còn nếu có rồi thì chuyển trạng thái bằng true
        if (docCheck.empty) {
            let id = uuid();
            try {
                const time = Timestamp.now();
                await setDoc(doc(db, "detailActive", id), {
                    id: id,
                    IdUser: idUser,
                    IdActive: idActive,
                    pass: true,
                    notes: [],
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
    //Kết thúc video

    const handleCloseSuccess = () => {
        setSuccess(false);
    }


    /*Kiểm tra thời gian tua của người dùng  */
    const [currentTime, setCurrentTime] = useState("");
    const [countSeek, setCountSeek] = useState(0);
    const [timeStartSeek, setTimeStartSeek] = useState("");
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountSeek(0);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [countSeek])
    const handleSeeked = () => {
        if (checkPass === false) {
            const newTime = videoRef.current.currentTime;
            setCountSeek(prevCountSeek => prevCountSeek + 1);
            if (countSeek === 1) {
                setTimeStartSeek(newTime);
            }
            if (countSeek === 3) {
                videoRef.current.pause();
                alert("Bạn đang tua quá nhanh vui lòng coi chậm lại !");
                videoRef.current.currentTime = timeStartSeek;
                setCountSeek(0);
                if(videoRef.current.pause())
                    videoRef.current.play();
                videoRef.current.play();
            }
        }
    };
    const handleUpdate = () => {
        if (checkPass === false) {
            const newTime = videoRef.current.currentTime;
            // Lấy thời điểm trước khi tua
            if (!videoRef.current.seeking) {
                const t = newTime - currentTime;
                // Cập nhật thời gian
                if (t >= 30) {
                    videoRef.current.pause();
                    alert("Bạn đang tua quá nhanh vui lòng coi chậm lại !");
                    videoRef.current.currentTime = currentTime;
                    if(videoRef.current.pause())
                    videoRef.current.play();
                }
                else {
                    setCurrentTime(newTime);
                }
            }
        }
        setTime(videoRef.current.currentTime);
    };
    /*Kiểm tra thời gian tua của người dùng  */
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        if (isDrawerOpen === true)
            videoRef.current.play();
        else
            videoRef.current.pause();
        setIsDrawerOpen(!isDrawerOpen);
    };
    const [note, setNote] = useState("");
    const handleNote = async (e) => {
        e.preventDefault();
        try {
            const docUser = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docUser.data().id;
            const q = query(collection(db, "detailActive"), where("IdActive", "==", idActive), where("IdUser", "==", idUser));
            const docCheck = await getDocs(q);
            const time = videoRef.current.currentTime;
            let timeNote = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : "" + Math.floor(time / 60);
            timeNote = timeNote + ":" + (Math.floor(time % 60) < 10 ? "0" + Math.floor(time % 60) : "" + Math.floor(time % 60));
            //toggleDrawer();
            if (docCheck.empty) {
                let id = uuid();
                try {
                    await setDoc(doc(db, "detailActive", id), {
                        id: id,
                        IdUser: idUser,
                        IdActive: idActive,
                        pass: false,
                        notes: [{ note: note, timeNote: timeNote }]
                    });
                    alert("Thêm thành công");
                    setNote("");
                    toggleDrawer();
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                //console.log("Đmqt");
                const idDetail = docCheck.docs[0].data().id;
               // console.log(idDetail);
                await updateDoc(doc(db, "detailActive", idDetail), {
                    notes: arrayUnion({
                        note: note, timeNote: timeNote
                    })
                });
                alert("Thêm thành công");
                setNote("");
                toggleDrawer();
            }
        } catch (error) {
            console.log(error)
        }

    }
    return (
        activeAll.length>0 &&
        <div class="h-full">
            {roadMap && course && <Header idActive={idActive} nameCourse={course.nameCourse} indexActive={indexActive} sumActive={sumActive}></Header>}
            {err && <h1 style={{ color: red }}>Course not found</h1>}
            <div class="flex flex-row h-96">
                {
                    active &&
                        active.type === 1 ?
                        <div style={{ flex: 0.70, backgroundColor: "black", height: 600, paddingLeft: 100, paddingRight: 100 }}>
                            <video
                                ref={videoRef}
                                class="w-full h-full" controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={handleEndVideo}
                                onTimeUpdate={handleUpdate}
                                onSeeked={handleSeeked}
                            >
                                <source
                                    src={active.videoURL}
                                    type="video/mp4"></source>
                            </video>
                            <div style={{ width: '100%', marginLeft: 60, marginTop: 30, display: 'flex', flexDirection: 'row' }}>
                                <div>
                                    <p style={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>{active && active.nameActive}</p>
                                    <p style={{ fontSize: 18, }}>Cập nhật {active && moment(active.timeUpdate.toDate()).format('DD/MM/YYYY')}</p>
                                </div>
                                <div className="w-full flex relative justify-end">
                                    <div className="flex relative">
                                        <input type="checkbox" id="drawer-toggle" className="absolute sr-only" checked={isDrawerOpen} onChange={toggleDrawer} />
                                        <label htmlFor="drawer-toggle" className="mr-5 font-medium hover:text-gray-900 cursor-pointer">
                                            Thêm Ghi chú
                                        </label>
                                        <div style={{ width: '100%', height: '40%' }} className={`fixed bottom-0 right-0 z-20 transition-all duration-500 transform ${isDrawerOpen ? '' : 'translate-y-full'} bg-white shadow-lg`}>
                                            <div className="bg-white" style={{
                                                height: "80px",
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: 'column',
                                            }}>
                                                <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                                                    <p style={{ fontSize: 25, fontWeight: "bold", color: 'black' }}>
                                                        Ghi chú  {Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60)}
                                                        :{Math.floor(time % 60) < 10 ? "0" + Math.floor(time % 60) : Math.floor(time % 60)}
                                                    </p>
                                                </div>
                                                <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                                                    <button type="button" onClick={toggleDrawer} className="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                                                        <span className="sr-only">Close</span>
                                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ paddingLeft: 20, paddingRight: 20 }} >
                                                <form onSubmit={handleNote}>
                                                    <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                                        <div class="md:col-span-2 w-full">
                                                            <input type="text" id="fname" name="fname" placeholder="Nội dung ghi chú"
                                                                value={note}
                                                                onChange={(e) => setNote(e.target.value)}
                                                                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                                            />
                                                        </div>
                                                        <div class="md:col-span-2">
                                                            <button
                                                                class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Thêm</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        active && active.type === 2 ?
                            <LearingType2 active={active} activeAll={activeAll} idcourse={idcourse} /> :
                        active.type ===3 ?
                            <LearingType3 active={active} activeAll={activeAll} idcourse={idcourse}/> :
                        active.type ===4 ?
                            <LearingType4 active={active} activeAll={activeAll} idcourse={idcourse}/> :
                            <LearingType5 active={active} activeAll={activeAll} idcourse={idcourse}/>
                }
                <div style={{ flex: 0.30 }}>
                    {
                        roadMap &&
                        roadMap.map((it) => (
                            <RoadMapUser
                                key={it.IdRoadMap}
                                IdCourse={course.id}
                                descriptionRoadMap={it.descriptionRoadMap}
                                nameRoadMap={it.nameRoadMap}
                                IdRoadMap={it.IdRoadMap}
                                active={activeAll}
                                currentActive={idActive}
                            />
                        ))
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

export default Learing;