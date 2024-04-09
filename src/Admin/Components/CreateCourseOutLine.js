import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { v4 as uuid } from 'uuid';
import { db, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../../context/AuthContext";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
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
const editorConfiguration = {
    toolbar: {
        items: [
            'undo', 'redo',
            '|', 'heading',
            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
            '-', // break point
            '|', 'alignment',
            'link', 'uploadImage', 'blockQuote', 'codeBlock',
            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
        ],
        shouldNotGroupWhenFull: true
    }
};
function CreateCourseOutline() {
    const { currentUser } = useContext(AuthContext);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [err, setErr] = useState(false);

    const [content, setContent] = useState("");
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e);
        const id = uuid();
        const nameCourse = e.target[0].value;
        const photoURL = e.target[1].files[0];
        const storageRef = ref(storage, `Course/${nameCourse + id}`);
        try {
            await uploadBytesResumable(storageRef, photoURL).then(() => {
                getDownloadURL(storageRef).then(async (dowloadURL) => {
                    try {
                        const getUser = await getDoc(doc(db, "users", currentUser.uid));
                        const teacher = getUser.data().id;
                        await setDoc(doc(db, "courseOutline", id), {
                            id: id,
                            nameCourse: nameCourse,
                            teacher: teacher,
                            content: content,
                            photoURL: dowloadURL,
                            isPublic: false,
                            sumCourse: 0,
                            rating: 0,
                        })
                        await setDoc(doc(db, "certificate", id), {
                            id: id,
                            users: []
                        })
                        setIsOpen(false);
                    } catch (error) {
                        setErr(true);
                    }
                })
            })
        } catch (err) {
            setErr(true);
        }
    }

    return (
        <div>
            <button
                onClick={openModal}
                type="button"
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Tạo lộ trình học
            </button>
            {err && <span>Lỗi tạo lộ trình học học</span>}
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
                <div style={{ padding: "20px" }}>
                    <form onSubmit={handleSubmit}>
                        <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
                            <div class="md:col-span-2">
                                <input type="text" id="fname" name="fname" placeholder="Tên khóa học"
                                    class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                                />
                            </div>
                            <div class="md:col-span-2">
                                <label for="subject" class="float-left block  font-normal text-gray-400 text-lg">Chọn hình ảnh của lộ trình:</label>
                                <input type="file" id="file" name="file" placeholder="Charger votre fichier" class="peer block w-full appearance-none border-none   bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0" />
                            </div>
                            <div class="md:col-span-2">
                                <CKEditor
                                    editor={Editor}
                                    config={editorConfiguration}
                                    data="<p>Hello from CKEditor&nbsp;5!</p>"
                                    onReady={(editor) => {
                                        // You can store the "editor" and use when it is needed.
                                        console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const valuData = editor.getData();
                                        setContent(valuData);
                                    }}
                                    onBlur={(event, editor) => {
                                        console.log('Blur.', editor);
                                    }}
                                    onFocus={(event, editor) => {
                                        console.log('Focus.', editor);
                                    }}
                                />
                            </div>
                            <div class="md:col-span-2">
                                <button class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo khóa học</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

        </div>
    );
}

export default CreateCourseOutline;