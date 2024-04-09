import React, { useContext, useState } from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Timestamp, collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
const topics = [
    'Python', 'Javascript', 'Node', 'PHP',
    'React', 'Java', 'C#', 'Ruby',
    'HTML', 'CSS', 'Angular', 'Vue.js',
    'MySQL', 'MongoDB', 'Express', 'Django',
    'Spring', 'Laravel', 'ASP.NET', 'Ruby on Rails'
    // Add more topics as needed
];
function CreateBlog() {
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [hastag, setHastag] = useState("");
    const [checkedHastag, setChecked] = useState(false);
    const navigate = useNavigate();
    const check = (value) => {
        setHastag(value);
        setChecked(!checkedHastag);
    }
    const handleSubmit = async () => {
        try {
            let id = 1; // hoặc giá trị ban đầu mong muốn
            // Tạo một truy vấn để lấy ID cuối cùng
            const q = query(collection(db, "blogs"), orderBy("id", "desc"), limit(1));

            // Lấy ID cuối cùng
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                const lastId = lastDoc.data().id;
                id = parseInt(lastId.substring(2)) + 1;
            }
            id = "Bl" + id;
            const idUser = currentUser.uid;
            const timePost = Timestamp.now();
            await setDoc(doc(db, "blogs", id), {
                id: id,
                title: title,
                content: content,
                auth: idUser,
                datePost: timePost,
                hastag: hastag,
                like: 0,
                comment: [],
            })
            navigate("/Blog");
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <div class="bg-white shadow p-4 py-8" x-data="{ images: [] }">
            <div class="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Blog</div>
            <input class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none w-full" onChange={(e) => { setTitle(e.target.value) }} spellcheck="false" placeholder="Tiêu đề" type="text"></input>
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
            <div class="relative mt-4">
                <div class="h-10 bg-white flex border border-gray-200 rounded items-center">
                    <input value={hastag} onChange={(e) => { setHastag(e.target.value) }} name="select" id="select" class="px-4 appearance-none outline-none text-gray-800 w-full" checked />

                    <button class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600">
                        <svg class="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <label for="show_more" class="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-gray-600">
                        <svg class="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </label>
                </div>

                <input type="checkbox" name="show_more" id="show_more" class="hidden peer" checked={checkedHastag} onChange={() => setChecked(!checkedHastag)} />
                <div class="absolute rounded shadow bg-white overflow-hidden hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200">
                    {
                        topics.map((item, index) => (
                            <button key={index} onClick={() => { check(item) }} class="cursor-pointer group">
                                <p class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">{item}</p>
                            </button>
                        ))
                    }
                </div>
            </div>
            <div class="w-full flex items-center justify-center mt-3">
                <button onClick={handleSubmit} class="rounded-xl float-right border-2 border-blue-500 px-3 py-3 text-base mb-3 font-medium text-blue-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5">
                    Xuất bản
                </button>
            </div>
        </div>
    );
}

export default CreateBlog;