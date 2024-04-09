import React, { useEffect, useState } from "react";

import Modal from 'react-modal';
import { Button } from "flowbite-react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

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
function DetailActiveUser(props) {
    const active = props.active;
    const IdUser = props.IdUser;
    const checkRole= props.role;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [statusArray, setStatusArray] = useState([]);
    const fetchData1 = async () => {
        try {
            const dt =[];
            const getStatus = active.map(async (item) => {
                const q = query(
                    collection(db, "detailActive"),
                    where("IdActive", "==", item.id),
                    where("IdUser", "==", IdUser)
                );
                let tmp =item.data();
                const docActiveUser = await getDocs(q);
                let c = null;

                docActiveUser.forEach((i) => {
                    if (i.exists()) c = i.data();
                });

                if (c !== null) {
                   tmp.status = c.fileURL;
                   tmp.idDetail=c.id;
                   tmp.point=c.point;
                   tmp.comment=c.comment;
                } else {
                    tmp.status = "Chưa có file";
                }
                dt.push(tmp);
                console.log(tmp);
            });

            await Promise.all(getStatus);
            setStatusArray(dt);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (modalIsOpen) {
            // Modal is open, update statusArray and fetch data
            const fetchData = async () => {
                try {
                    const dt =[];
                    const getStatus = active.map(async (item) => {
                        const q = query(
                            collection(db, "detailActive"),
                            where("IdActive", "==", item.id),
                            where("IdUser", "==", IdUser)
                        );
                        let tmp =item.data();
                        const docActiveUser = await getDocs(q);
                        let c = null;

                        docActiveUser.forEach((i) => {
                            if (i.exists()) c = i.data();
                        });

                        if (c !== null) {
                           tmp.status = c.fileURL;
                           tmp.idDetail=c.id;
                           tmp.point=c.point;
                           tmp.comment=c.comment;
                        } else {
                            tmp.status = "Chưa có file";
                        }
                        dt.push(tmp);
                        console.log(tmp);
                    });

                    await Promise.all(getStatus);
                    setStatusArray(dt);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();
        }
    }, [modalIsOpen, active, IdUser]);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    //Chấm điểm
    const [checkPoint,setCheckPoint]=useState(false); //đóng mở form
    const [bt,setBt]=useState(null); //Chi tiết hoạt động
    const [point,setPoint]=useState(0);
    const [comment,setComment]=useState("");
    const closeCheckPoint = ()=>{
        setCheckPoint(false)
    }
    const ratting = async (e)=>{
        e.preventDefault();
        try {
            console.log(bt.idDetail);
            const idDetail=bt.idDetail+"";
            await updateDoc(doc(db,"detailActive",idDetail),{
                point: point,
                comment: comment
            })
            fetchData1();
            setCheckPoint(false);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Button onClick={() => openModal()} color="blue">Chi tiết</Button>
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
                <div className=" overflow-y-auto" style={{ maxHeight: 800}}>
                    {
                        statusArray &&
                        <div>
                            <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700 p-10">
                                {
                                    statusArray.map((it, index) => (
                                        <li class="pb-3 sm:pb-4">
                                            <div class="flex items-center space-x-4 rtl:space-x-reverse p-2">
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {it.id}
                                                    </p>
                                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {it.nameActive}
                                                    </p>
                                                </div>
                                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"> 
                                                    {
                                                        it.status!=="Chưa có file" &&
                                                        <a href={it.status} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                                        Tải file
                                                        </a>
                                                    }                    
                                                </div>
                                                <button type="button" onClick={()=>{setCheckPoint(true); setBt(it); setPoint(it.point); setComment(it.comment)}} class="bg-blue-500 py-2 px-4 text-white rounded-md hover:bg-blue-600 focus:outline-none">Chấm điểm</button>
                                            </div>   
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    }
                </div>
            </Modal>
            {
                bt && 
                <Modal
                isOpen={checkPoint}
                onRequestClose={closeCheckPoint}
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
                        {
                            checkRole === 1 ?
                            <p style={{ fontSize: 25, fontWeight: "bold" }}>Chấm điểm cho hoạt động trong khóa học</p> :
                            <p style={{ fontSize: 25, fontWeight: "bold" }}>Điểm và đánh giá của giáo viên là</p>
                        }
                    </div>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeCheckPoint} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                {
                    checkRole===1 ?  
                        <form action="#" onSubmit={ratting} class="flex flex-col items-center">
                            <input type="number" value={point} onChange={(e)=>{setPoint(e.target.value)}} name="name" placeholder="Điểm" class="py-2 px-4 rounded-md focus:outline-none mb-4" required />
                            <textarea name="message" value={comment} onChange={(e)=>{setComment(e.target.value)}}placeholder="Đánh giá" rows="4" class="py-2 px-4rounded-md focus:outline-none mb-4 resize-none w-full" required></textarea>
                            <button type="submit" class="bg-blue-500 py-2 px-4 text-white rounded-md hover:bg-blue-600 focus:outline-none">Send</button>
                        </form>
                    :
                        <form action="#" onSubmit={ratting} class="flex flex-col items-center">
                            <input type="number" disabled value={point} onChange={(e)=>{setPoint(e.target.value)}} name="name" placeholder="Điểm" class="py-2 px-4 rounded-md focus:outline-none mb-4" required />
                            <textarea name="message" disabled value={comment} onChange={(e)=>{setComment(e.target.value)}}placeholder="Đánh giá" rows="4" class="py-2 px-4rounded-md focus:outline-none mb-4 resize-none w-full" required></textarea>
                        </form>
                }
            </Modal>
            }
        </div>
    );
}

export default DetailActiveUser;