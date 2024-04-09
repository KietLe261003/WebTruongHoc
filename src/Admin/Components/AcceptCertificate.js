import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import emailjs from '@emailjs/browser';
import Modal from 'react-modal';
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
function AcceptCertificate(props) {
    const inforUser = props.inforUser;
    const idCourse = props.idCourse;
    const reason = props.reason;
    const [course, setCourse] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    const [modalIsOpen1, setIsOpen1] = useState(false);
    function openModal1() {
        setIsOpen1(true);
    }
    function closeModal1() {
        setIsOpen1(false);
    }
    useEffect(() => {
        const getCourse = async () => {
            const docCourse = await getDoc(doc(db, "course", idCourse));
            docCourse.exists() && setCourse(docCourse.data());
        }
        return () => {
            getCourse();
        }
    }, [idCourse])
    const form = useRef();
    const form1 = useRef();
    const sendEmail = async () => {
        try {
            // Gửi email với dữ liệu từ form
            await emailjs.sendForm('service_8vqpeod', 'template_uqhpzav', form.current, {
                publicKey: 'G8u7WveoEPjHb7bPA',
            });

            console.log('SUCCESS!');
        } catch (error) {
            console.log('FAILED...', error.text);
        }
    };


    const handleAccept = async () => {
        try {
            const getCertificate = await getDoc(doc(db, "certificate", idCourse));
            const data = getCertificate.data().users;
            const inforUserTime = inforUser.time.toDate();
            // Tìm vị trí của inforUser trong mảng data
            const index = data.findIndex((item) => {
                const itemTime = item.time.toDate();
                return item.IdUser === inforUser.IdUser && itemTime.getTime() === inforUserTime.getTime();
            });
            if (index !== -1) {
                data[index].status = 1;
                await updateDoc(doc(db, "certificate", idCourse), {
                    users: data
                })

                const formData = new FormData();
                formData.append('user_name', inforUser.name);
                formData.append('user_email', inforUser.email);
                formData.append('Name_Course', course.nameCourse);
                formData.append('Address', inforUser.address);
                formData.append('Phone_Number', inforUser.phoneNumber);

                // Gửi email với dữ liệu từ form
                await sendEmail(formData);

                alert("Cập nhật thành công !");
                window.location.reload();
            } else {
                alert('Không tìm thấy yêu cầu chứng chỉ của người dùng này !');
            }
        } catch (error) {
            console.error('Error handling acceptance: ', error);
        }
    }

    const sendEmail1 = async (e) => {
        e.preventDefault();
        //console.log(e.target[0].value);
        const getCertificate = await getDoc(doc(db, "certificate", idCourse));
        const data = getCertificate.data().users;

        const inforUserTime = inforUser.time.toDate();
        // Tìm vị trí của inforUser trong mảng data
        const index = data.findIndex((item) => {
            const itemTime = item.time.toDate();
            return item.IdUser === inforUser.IdUser && itemTime.getTime() === inforUserTime.getTime();
        });
        if (index !== -1) {
            data[index].status = -1;
            await updateDoc(doc(db, "certificate", idCourse), {
                users: data
            })
            emailjs
                .sendForm('service_8vqpeod', 'template_k7j371r', form1.current, {
                    publicKey: 'G8u7WveoEPjHb7bPA',
                })
                .then(
                    () => {
                        closeModal();
                        console.log('SUCCESS!');
                    },
                    (error) => {
                        console.log('FAILED...', error.text);
                    },
                );
            alert("Cập nhật thành công !");
            window.location.reload();
        }
        else {
            alert("Không tìm thấy yêu cầu của người dùng !")
        }

    };
    return (
        <div>
            {
                inforUser.status === 0 ?
                    <div>
                        <div class="flex m-2">
                            <button
                                onClick={handleAccept}
                                class="middle none center mr-4 rounded-lg bg-green-500 py-0 px-1 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                data-ripple-light="true"
                            >
                                Chấp nhận
                            </button>
                            <button onClick={openModal}
                                class="middle none center rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                data-ripple-light="true"
                            >
                                Hủy
                            </button>
                        </div>
                        {
                            reason !== undefined && reason !== "" &&
                            <div className="w-full flex items-center justify-center">
                                <button
                                    onClick={openModal1}
                                    class="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    data-ripple-light="true"
                                >
                                    Lý do
                                </button>
                            </div>
                        }
                    </div> :
                    inforUser.status === 1 ?
                        <div class="flex m-2">
                            <button
                                class="middle none center mr-4 rounded-lg bg-green-500 py-0 px-1 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                data-ripple-light="true"
                            >
                                Chấp nhận
                            </button>
                        </div> :
                        <div class="flex m-2">
                            <button
                                class="middle none center rounded-lg bg-red-500 py-0 px-1 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                data-ripple-light="true"
                            >
                                Hủy
                            </button>
                        </div>
            }
            {
                course &&
                <form ref={form} hidden onSubmit={sendEmail}>
                    <input type="text" value={inforUser.name} name="user_name" />
                    <input type="email" value={inforUser.email} name="user_email" />
                    <input type="text" value={course.nameCourse} name="Name_Course" />
                    <input type="text" value={inforUser.address} name="Address" />
                    <input type="text" value={inforUser.phoneNumber} name="Phone_Number" />
                    <input type="submit" value="Send" />
                </form>
            }
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
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Mô tả lý do không phê duyệt</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModal} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div style={{ padding: "20px" }}>
                    {
                        course &&
                        <form ref={form1} onSubmit={sendEmail1} class="space-y-8">
                            <input type="text" hidden value={inforUser.name} name="user_name" />
                            <input type="text" hidden value={inforUser.email} name="user_email" />
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email</label>
                                <input type="email" value={inforUser.email} disabled id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required />
                            </div>
                            <div>
                                <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Tiêu đề</label>
                                <input type="text" name="subject" id="subject" class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Nhập tiêu đề" required />
                            </div>
                            <div class="sm:col-span-2">
                                <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Nội dung</label>
                                <textarea id="message" name="message" rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nội dung lý do tại sao lại hủy"></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <button class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Gửi</button>
                            </div>
                        </form>
                    }
                </div>
            </Modal>
            <Modal
                isOpen={modalIsOpen1}
                onRequestClose={closeModal1}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div class="bg-blue-400" style={{
                    height: "80px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Lý do yêu cầu cấp lại</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModal1} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div style={{ padding: "20px" }}>
                    {
                        reason &&
                        <p>
                            {reason}
                        </p>
                    }
                </div>
            </Modal>
        </div>
    );
}

export default AcceptCertificate;