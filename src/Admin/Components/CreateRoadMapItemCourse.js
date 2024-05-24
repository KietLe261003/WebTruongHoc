import { Timestamp, collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import Modal from "react-modal";
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
function CreateRoadMap(props) {
    const IdCourse = props.IdCourse;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [err, setErr] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const nameRoadMap = e.target[0].value;
        const description = e.target[1].value;
        try {
            let id = 1; // hoặc giá trị ban đầu mong muốn
            // Tạo một truy vấn để lấy ID cuối cùng
            const q = query(collection(db, "courseRoadMap"), orderBy("numberRoadMap", "desc"), limit(1));

            // Lấy ID cuối cùng
            const querySnapshot = await getDocs(q);
            let numberRoadMap = 1;
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                const lastId = lastDoc.data().numberRoadMap;
                id=lastId+1;
                numberRoadMap=lastId+1;
            }
            id="RM"+id;
            const time = Timestamp.now();
            await setDoc(doc(db, "courseRoadMap", id), {
                IdRoadMap: id,
                nameRoadMap: nameRoadMap,
                descriptionRoadMap: description,
                IdCourse: IdCourse,
                numberRoadMap: numberRoadMap,
                timeCreate: time
            })
            alert("Thêm thành công");
            window.location.reload();
            closeModal();
        } catch (error) {
            console.log(error);
            setErr(true);
        }
    }
    return (
        <div>
            <button
                onClick={openModal}
                type="button"
                class="bg-blue-400 px-5 py-3 text-sm shadow-sm font-medium tracking-wider  text-blue-100 rounded-full hover:shadow-2xl hover:bg-blue-500">Tạo Chương</button>
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
                        <p style={{ fontSize: 25, fontWeight: "bold" }}>Tạo chương cho khóa học</p>
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
                                    class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo </button>
                            </div>
                        </div>
                    </form>
                </div>
                {err && <span>Thêm thất cmn bại</span>}
            </Modal>
        </div>
    );
}

export default CreateRoadMap;