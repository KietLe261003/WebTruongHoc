import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
function LearingType2(props) {
    const active = props.active;
    const activeAll = props.activeAll;
    const idcourse = props.idcourse;
    const { currentUser } = useContext(AuthContext);
    const [fileName, setFileName] = useState('Upload or drag & drop your file SVG, PNG, JPG, or GIF.');
    const handleFileChange = (event) => {
        const fileInput = event.target;
        if (fileInput.files.length > 0) {
            setFileName(fileInput.files[0].name);
        } else {
            setFileName('Upload or drag & drop your file SVG, PNG, JPG, or GIF.');
        }
    };
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const updateFinal = async (idUser,currentActive)=>{
        const ref = collection(db, "listCourseUser");
                const q1 = query(ref, where("IdUser", "==", idUser), where("IdCourse", "==", idcourse));
                const docCheck = await getDocs(q1);
                if (!docCheck.empty) {
                    const fl=(currentActive+1)/activeAll.length*100;
                    //alert(fl);
                    try {
                        await updateDoc(doc(db,"listCourseUser",docCheck.docs[0].data().id),{
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        if (file !== undefined) {
            const currentActive = activeAll.findIndex(ob => ob.id === active.id);
            let nextActive = -1;
            if (currentActive !== -1)
                nextActive = currentActive === activeAll.length - 1 ? activeAll[currentActive] : activeAll[currentActive + 1];
            else {
                window.location.reload();
            }
            const docUser = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docUser.data().id;
            const storageRef = ref(storage, `FileActive/${active.id + idUser}`);
            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        const q = query(collection(db, "detailActive"), where("IdActive", "==", active.id), where("IdUser", "==", idUser));
                        const docCheck = await getDocs(q);
                        if (docCheck.empty) {
                            let id = uuid();
                            try {
                                await setDoc(doc(db, "detailActive", id), {
                                    id: id,
                                    IdUser: idUser,
                                    IdActive: active.id,
                                    pass: true,
                                    fileURL: downloadURL,
                                    timeUpdate: serverTimestamp()
                                });
                                if(currentActive===activeAll.length-1)
                                {
                                    const timeComple = Timestamp.now();
                                    await updateDoc(doc(db, "users", currentUser.uid), {
                                        courseComplete: arrayUnion({ idcourse: idcourse, time: timeComple })
                                    });
                                }
                                updateFinal(idUser,currentActive);
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
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        else {
                            
                            const idDetail = docCheck.docs[0].data().id;
                            if(docCheck.docs[0].data().pass===false)
                            {
                                await updateDoc(doc(db, "detailActive", idDetail), {
                                    pass: true,
                                    fileURL: downloadURL,
                                    timeUpdate: serverTimestamp()
                                });
                                if(currentActive===activeAll.length-1)
                                {
                                    const timeComple = Timestamp.now();
                                    await updateDoc(doc(db, "users", currentUser.uid), {
                                        courseComplete: arrayUnion({ idcourse: idcourse, time: timeComple })
                                    });
                                }
                                updateFinal(idUser,currentActive);
                                setSuccess(true);
                                const timeoutId = setTimeout(() => {
                                    setSuccess(false);
                                    if (currentActive === activeAll.length - 1) {
                                        navigate(`/Course/CompleCourse/${idcourse}`);
                                    }
                                    else {
                                        navigate(`/learing/${nextActive}/${idcourse}`);
                                        window.location.reload();
                                    }
                                }, 3000);
                                console.log(timeoutId);
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                });
            });
        }
    }
    const handleCloseSuccess = () => {
        setSuccess(false);
    }
    return (
        <div style={{ flex: 0.70, height: 600 }}>
            {
                active &&
                <div class="px-5 py-5 bg-gray-100 rounded-b-lg dark:bg-gray-800">
                    <textarea id="editor" value={active.content} disabled rows={"20"} class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder=""
                        style={{ resize: 'none' }}>
                    </textarea>
                </div>
            }
            <form onSubmit={handleSubmit}>
                <main className="flex flex-col items-center justify-center bg-gray-100 font-sans">
                    <label htmlFor="dropzone-file" className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>

                        <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">Nộp file</h2>

                        <p className="mt-2 text-gray-500 tracking-wide">{fileName}</p>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    <div class="md:col-span-2" style={{ width: '50%', margin: 30 }}>
                        <button
                            class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Nộp</button>
                    </div>
                </main>
            </form>
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

export default LearingType2;