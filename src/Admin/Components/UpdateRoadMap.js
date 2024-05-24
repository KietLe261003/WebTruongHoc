import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { db, storage } from "../../firebase";
import Modal from 'react-modal';
import { Button } from "flowbite-react";
import { deleteObject, ref } from "firebase/storage";

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
function UpdateRoadMap(props) {
    const IdroadMap = props.roadMap;
    const nameRoadMapcurr = props.nameRoadMap;
    const descriptionRoadMap = props.descriptionRoadMap;
    const IdCourse = props.IdCourse;
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    const handleSubmit = async (e) => {
        //alert(roadMap);
        e.preventDefault();
        let nameRoadMap = e.target[0].value;
        let description = e.target[1].value;
        if (nameRoadMap === "")
            nameRoadMap = nameRoadMapcurr;
        if (description === "")
            description = descriptionRoadMap;
        try {
            await updateDoc(doc(db, "courseRoadMap", IdroadMap), {
                nameRoadMap: nameRoadMap,
                descriptionRoadMap: description,
            })
            alert("Cập nhật thành công");
            closeModal();
            window.location.reload();
        } catch (error) {
            console.log(error);
            //alert("Đã xảy ra lỗi trong quá trình cập nhật");
        }
    }
    const handleDelete = async () => {
        const choice = window.confirm(
            "Bạn có chắc muốn xóa chương này không"
        )
        if (choice) {
            const q = query(collection(db, "active"), where("idRoadMap", "==", IdroadMap));
            const getActive = await getDocs(q);

            const deletePromises = [];

            getActive.forEach(async (it) => {
                const active = it.data();
            
                const deleteActivePromise = deleteDoc(doc(db, "active", active.id));
            
                // Kiểm tra nếu active.type === 1 thì mới xóa tệp
                if (active.type === 1) {
                    const desertRef = ref(storage, `Video/${IdCourse}/${IdroadMap}/${active.id}`);
                    const deleteFilePromise = deleteObject(desertRef);
                    deletePromises.push(deleteFilePromise);
                }
            
                const qd = query(collection(db, "detailActive"), where("IdActive", "==", active.id));
                const deleteDetail = await getDocs(qd);
            
                // Tạo một mảng promises cho việc xóa chi tiết active
                const deleteDetailPromises = deleteDetail.docs.map(async (item) => {
                    if (item.exists()) {
                        const idD = item.data().id + "";
                        try {
                            await deleteDoc(doc(db, "detailActive", idD));
                        } catch (error) {
                            alert("Lỗi xóa detail");
                            console.log(error);
                        }
                    }
                });
                await Promise.all(deleteDetailPromises);
            
                deletePromises.push(deleteActivePromise);
            });
            try {
                await Promise.all(deletePromises);
                await deleteDoc(doc(db, "courseRoadMap", IdroadMap));
                window.location.reload(); // reload lại trang
            } catch (error) {
                alert("Có lỗi xảy ra trong quá trình xóa");
            }


        }
    }
    return (
        <div class="flex flex-row justify-center items-center">
            <Button onClick={() => openModal()} color="warning">Sửa</Button>
            <Button onClick={() => handleDelete()} color="failure">Xóa</Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div class="bg-blue-400" style={{
                    height: "80px",
                    width: "800px",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Điền nội dung muốn cập nhật</p>
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
                <div style={{ padding: "20px" }}>
                    <form onSubmit={handleSubmit}>
                        <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div class="md:col-span-2 w-full">
                                <input type="text" id="fname" name="fname" placeholder="Tên chương"
                                    class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                />
                            </div>
                            <div class="md:col-span-2">
                                <textarea name="message" rows="5" cols="" placeholder="Mô tả ngắn gọn về chương" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <button
                                    type="submit"
                                    class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Cập nhật</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default UpdateRoadMap;