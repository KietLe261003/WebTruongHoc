import React, { useEffect, useState } from "react";

import Modal from 'react-modal';
import { Button } from "flowbite-react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
    const [modalIsOpen, setIsOpen] = useState(false);
    const [statusArray, setStatusArray] = useState([]);
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
                                                <a href={it.status} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                                Tải file</a>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                }
            </Modal>
        </div>
    );
}

export default DetailActiveUser;