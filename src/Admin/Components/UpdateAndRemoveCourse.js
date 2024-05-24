import { Button } from "flowbite-react";
import React, { useState } from "react";
import Modal from 'react-modal';
import { db, storage } from "../../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Timestamp, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
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
function UpdateAndRemoveCourse(props) {

    const course = props.course;

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    const [modalIsOpenImg, setIsOpenImg] = useState(false);
    function openModalImg() {
        setIsOpenImg(true);
    }
    function closeModalImg() {
        setIsOpenImg(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let nameCourse = e.target[0].value;
        const photoURL = e.target[1].files[0];
        let description = e.target[2].value;

        if (nameCourse === "") {
            nameCourse = course.nameCourse;
        }

        if (description === "") {
            description = course.description;
        }
        const timeUpdate = Timestamp.now();
        if (photoURL != null) {
            const desertRef = ref(storage, `Course/${course.nameCourse + course.id}`);
            deleteObject(desertRef);
            const storageRef = ref(storage, `Course/${course.id}`);
            try {
                await uploadBytesResumable(storageRef, photoURL).then(() => {
                    getDownloadURL(storageRef).then(async (dowloadURL) => {
                        try {
                            await updateDoc(doc(db, "course", course.id), {
                                nameCourse: nameCourse,
                                photoURL: dowloadURL,
                                description: description,
                                timeUpdate: timeUpdate
                            })
                            alert("Cập nhật thành công");
                            setIsOpen(false);
                            window.location.reload();
                        } catch (error) {
                            alert("Lỗi trong quá trình cập nhật");
                        }
                    })
                })
            } catch (err) {
                alert("Lỗi trong quá trình cập nhật");
            }
        }
        else {
            try {
                await updateDoc(doc(db, "course", course.id), {
                    nameCourse: nameCourse,
                    description: description,
                    timeUpdate: timeUpdate
                })
                alert("Cập nhật thành công");
                setIsOpen(false);
                window.location.reload();
            } catch (error) {
                alert("Lỗi trong quá trình cập nhật");
            }
        }
    }
    const handlDelete = async () => {
        const choice = window.confirm("Bạn có chắc muốn xóa khóa học này hay không");
        if (choice) {
            const q = query(collection(db, "courseRoadMap"), where("IdCourse", "==", course.id));
            const getRoadMap = await getDocs(q);
            // Use Promise.all to wait for all delete operations to complete
            await Promise.all(getRoadMap.docs.map(async (it) => {
                const roadMap = it.data();
                const q = query(collection(db, "active"), where("idRoadMap", "==", roadMap.IdRoadMap));
                const getActive = await getDocs(q);
                const deletePromises = [];

                await Promise.all(getActive.docs.map(async (it1) => {
                    const active = it1.data();
                    const deleteActivePromise = deleteDoc(doc(db, "active", active.id));

                    if (active.type === 1) {
                        const desertRef = ref(storage, `Video/${course.id}/${roadMap.IdRoadMap}/${active.id}`);
                        const deleteFilePromise = deleteObject(desertRef);
                        deletePromises.push(deleteActivePromise, deleteFilePromise);
                    }
                    const qd = query(collection(db, "detailActive"), where("IdActive", "==", active.id));
                    const deleteDetail = await getDocs(qd);

                    // Tạo một mảng promises cho việc xóa chi tiết active
                    const deleteDetailPromises = deleteDetail.docs.map(async (item) => {
                        if(item.exists())
                        {
                            const idD=item.data().id+"";
                            try {
                                await deleteDoc(doc(db, "detailActive", idD));
                            } catch (error) {
                                alert("Lỗi xóa detail");
                                console.log(error);
                            }
                            
                        }
                    });
                    await Promise.all(deleteDetailPromises);
                }));

                try {
                    await Promise.all(deletePromises);
                    await deleteDoc(doc(db, "courseRoadMap", roadMap.IdRoadMap));
                } catch (error) {
                    alert("Có lỗi xảy ra trong quá trình xóa");
                }
            }));

            try {
                await deleteDoc(doc(db, "course", course.id));
                window.location.reload();
            } catch (error) {
                alert("Có lỗi xảy ra trong quá trình xóa");
            }
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={openModal} color="warning">Sửa</Button>
            <Button onClick={handlDelete} color="failure">Xóa</Button>

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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Tạo Khóa học mới</p>
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
                <div>
                    <div class="flex flex-row">
                        <div style={{ padding: "20px" }}>
                            <p class=" font-bold text-green-400">Nội dung hiện tại</p>
                            <form>
                                <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                    <div class="md:col-span-2">
                                        <input type="text" id="fname" name="fname" value={course.nameCourse}
                                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <input type="text" id="email" name="teacher" value={course.teacher}
                                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700" />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label for="subject" class="float-left block  font-normal text-gray-400 text-lg">Loại khóa học:</label>
                                        <select id="subject" name="subject"
                                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                            defaultValue={course.type === "0" ? "Trả phí" : "Miễn phí"} disabled>
                                             <option value={"1"}>{course.type === "1" ? "Trả phí" : "Miễn phí"} </option>

                                        </select>
                                    </div>
                                    <div class="md:col-span-2" style={{ width: 300 }}>
                                        <button type="button" onClick={openModalImg} class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Hình ảnh</button>
                                    </div>
                                    <div class="md:col-span-2">
                                        <textarea
                                            value={course.description} name="message" rows="10" cols="60"
                                            placeholder="Mô tả khóa học" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <p class=" font-bold text-orange-400">Nội dung sau khi sửa (để trống nếu không muốn thay đổi)</p>
                            <form onSubmit={handleSubmit}>
                                <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                                    <div class="md:col-span-2">
                                        <input type="text" id="fname" name="fname" placeholder="Tên khóa học"
                                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label for="subject" class="float-left block  font-normal text-gray-400 text-lg">Chọn hình ảnh của khóa học:</label>
                                        <input type="file" id="file" name="file" placeholder="Charger votre fichier" class="peer block w-full appearance-none border-none   bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0" />
                                    </div>
                                    <div class="md:col-span-2">
                                        <textarea name="message" rows="5" cols="" placeholder="Mô tả khóa học" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"></textarea>
                                    </div>
                                    <div class="md:col-span-2">
                                        <button class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Cập nhật</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalIsOpenImg}
                onRequestClose={closeModalImg}
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Ảnh nền</p>
                    </div>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModalImg} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex flex-row">
                    <img src={course.photoURL} alt="" width={1000} height={500} />
                </div>
            </Modal>
        </div>
    );
}

export default UpdateAndRemoveCourse;