import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { MDBCard, MDBCardBody, MDBCardText, MDBProgress, MDBProgressBar, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import DetailActiveUser from "../../Admin/Components/DetailActiveUser";
import { Button } from "flowbite-react";
import Modal from 'react-modal'
import CardCourese from "../Course/CardCourse";
import { useNavigate } from "react-router-dom";
const customStyles = {
    content: {
        width: 700,
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px'
    },
};
function ItemCourse(props) {
    const item = props.item;
    const [course, setCourse] = useState(null);
    const [active, setActive] = useState(null);
    const idCourse = item.IdCourse;
    const [modalIsOpen, setIsOpen] = useState(false);
    const navigate= useNavigate();
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    useEffect(() => {
        const getCourse = async () => {
            const docSnap = await getDoc(doc(db, "course", item.IdCourse));
            if (docSnap.exists()) {
                setCourse(docSnap.data());
            }
        }
        const getRoadMap = async () => {
            const rm = [];
            const ac = [];
            const q = query(collection(db, "courseRoadMap"), where("IdCourse", "==", idCourse));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                rm.push(doc.data());
                const activeQ = query(collection(db, "active"), where("idRoadMap", "==", doc.data().IdRoadMap), where("type", "==", 2));
                const getActive = await getDocs(activeQ);
                const ac1 = [];
                getActive.forEach((it) => {
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
            setActive(ac);
        }
        getRoadMap();
        return () => {
            getCourse();
        }
    }, [item, idCourse])
    return (
        course &&
        <div className="mb-5">
            <div className="flex mb-1">
                <MDBCardText className="mb-1" style={{ fontSize: '16px', fontWeight: 'bold', width: '100%' }}>{course.nameCourse}</MDBCardText>
                {
                    active &&
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button onClick={() => openModal()} color="blue">Chi tiết</Button>
                    </div>
                }
            </div>
            <MDBProgress className="rounded">
                <MDBProgressBar width={item.final} valuemin={0} valuemax={100} />
            </MDBProgress>
            <Modal
                isOpen={modalIsOpen}
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Hoạt động</p>
                    </div>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModal} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center px-3 py-5">
                    <CardCourese course={course}></CardCourese>
                    <div className="mt-3 w-full">
                        <MDBCard>
                            <MDBCardBody>
                                <MDBRow>
                                    <div className="flex flex-row w-full">
                                        <p className=" flex-auto" style={{ width: '100%', alignItems: 'center' }} >Các bài tập</p>
                                        {
                                            active &&
                                            <div className="text-muted w-full mb-2" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <DetailActiveUser role={0} active={active} IdUser={item.IdUser}></DetailActiveUser>
                                            </div>
                                        }
                                    </div>
                                </MDBRow>
                                <hr />
                                <div class="mb-3"></div>
                                <MDBRow>
                                    <div>
                                        <p className="mb-2" >Tiến độ hoàn thành: {item.final}%</p>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={item.final} valuemin={0} valuemax={100} />
                                        </MDBProgress>
                                    </div>
                                </MDBRow>
                        
                            </MDBCardBody>
                        </MDBCard>
                        {
                            item.final >= 100 &&
                            <button
                                class=" w-full mt-3 middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                data-ripple-light="true"
                                onClick={()=>{navigate(`/Course/CompleCourse/${item.IdCourse}`);}}
                            >
                                Yêu cầu cấp chứng chỉ
                            </button>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ItemCourse;