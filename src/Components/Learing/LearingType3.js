import { Editor } from "@monaco-editor/react";
import { Button, Input, Select } from "antd";
import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
const languProgram = [
    {
        label: "cpp",
        value: 54,
    },
    {
        label: "c",
        value: 50,
    },
    {
        label: "csharp",
        value: 51,
    },
    {
        label: "python",
        value: 71,
    },
    {
        label: "java",
        value: 62,
    },
    {
        label: "javascript",
        value: 63,
    },
];
function LearingType3(props) {
    const active = props.active;
    const activeAll = props.activeAll;
    const idcourse = props.idcourse;
    const [success, setSuccess] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [code, setCode] = useState("");
    const input = active.input;
    const [output, setOutput] = useState("");
    const [lang, setLang] = useState(54);
    const [compileLanguage, setCompileLanguage] = useState("cpp");
    const navigate = useNavigate();
    const Submit = async () => {
        if (code === "") {
            setOutput("Không có mã nguồn");
            return;
        }
        setOutput("Đang biên dịch...");
        const response = await fetch(
            "https://judge0-ce.p.rapidapi.com/submissions",
            {
                method: "POST",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "x-rapidapi-key": "2ced26e608mshd66269da74ea9d2p1f71f0jsn43db995303b6",
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    source_code: code,
                    stdin: input,
                    language_id: lang,
                    expected_output: active.answer,
                }),
            }
        );
        setOutput("Đang chạy...");
        const jsonResponse = await response.json();
        console.log(jsonResponse);

        let jsonGetSolution = {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
        };

        while (
            jsonGetSolution.stdout == null &&
            jsonGetSolution.time == null &&
            jsonGetSolution.memory == null &&
            jsonGetSolution.stderr == null &&
            jsonGetSolution.compile_output == null
        ) {
            if (jsonResponse.token) {
                let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

                const getSolution = await fetch(url, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "x-rapidapi-key": "2ced26e608mshd66269da74ea9d2p1f71f0jsn43db995303b6",
                        "content-type": "application/json",
                    },
                });

                jsonGetSolution = await getSolution.json();
                console.log(jsonGetSolution);
            }
        }
        if (jsonGetSolution.status.description !== "Accepted") {
            const output = atob(jsonGetSolution.stdout);
            setOutput(`Kết quả :\n\n${output}\n\n ${jsonGetSolution.status.description} Kết quả chưa đúng vui lòng thử lại`);
        } else if (jsonGetSolution.stdout) {
            const output = atob(jsonGetSolution.stdout);
            setOutput(
                `Kết quả :\n\n${output}\n\n Đáp án chính xác`
            );
            handleSubmit();
        } else if (jsonGetSolution.stderr) {
            const error = atob(jsonGetSolution.stderr);

            setOutput(`Lỗi :${error}`);
        } else {
            const compilation_error = atob(jsonGetSolution.compile_output);
            setOutput(`Lỗi biên dịch :${compilation_error}`);
        }
    };
    const handleCloseSuccess = () => {
        setSuccess(false);
    }

    const [time, setTime] = useState(0);
    useEffect(() => {
        if (time <= 60) {
            setTimeout(() => {
                setTime(time + 1);
            }, 1000)
        }
    }, [time])
    const updateFinal = async (idUser, currentActive) => {
        const ref = collection(db, "listCourseUser");
        const q1 = query(ref, where("IdUser", "==", idUser), where("IdCourse", "==", idcourse));
        const docCheck = await getDocs(q1);
        if (!docCheck.empty) {
            const fl = (currentActive + 1) / activeAll.length * 100;
            try {
                await updateDoc(doc(db, "listCourseUser", docCheck.docs[0].data().id), {
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
    const [next, setNext] = useState(null);
    const [current, setCurrent] = useState(null);
    const handleSubmit = async () => {
        //e.preventDefault();
        const currentActive = activeAll.findIndex(ob => ob.id === active.id);
        setCurrent(currentActive);
        let nextActive = -1;
        if (currentActive !== -1)
            nextActive = currentActive === activeAll.length - 1 ? activeAll[currentActive] : activeAll[currentActive + 1];
        else {
            window.location.reload();
        }
        
        const docUser = await getDoc(doc(db, "users", currentUser.uid));
        const idUser = docUser.data().id;
        const q = query(collection(db, "detailActive"), where("IdActive", "==", active.id), where("IdUser", "==", idUser));
        const docCheck = await getDocs(q);
        //Kiểm tra xem người dùng đã có trong bảng deailActive hay chưa nếu chưa thì thêm vào còn nếu có rồi thì chuyển trạng thái bằng true
        if (docCheck.empty) {
            let id = uuid();
            try {   
                const timecp= Timestamp.now();
                await setDoc(doc(db, "detailActive", id), {
                    id: id,
                    IdUser: idUser,
                    IdActive: active.id,
                    pass: true,
                    code: code,
                    timeUpdate: timecp
                });
                updateFinal(idUser, currentActive);
                if (currentActive === activeAll.length - 1) {
                    const timeComple = Timestamp.now();
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        courseComplete: arrayUnion({ idcourse: idcourse, time: timeComple })
                    });
                }
                setSuccess(true);
                setNext(nextActive);
                const timeoutId = setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                console.log(timeoutId);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            const idDetail = docCheck.docs[0].data().id;
            if (docCheck.docs[0].data().pass === false) {
                const timecp= Timestamp.now();
                await updateDoc(doc(db, "detailActive", idDetail), {
                    timeUpdate: timecp,
                    pass: true
                });
                if (currentActive === activeAll.length - 1) {
                    const timeComple = Timestamp.now();
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        courseComplete: arrayUnion({ idcourse: idcourse, time: timeComple })
                    });
                }
                updateFinal(idUser, currentActive);
                setSuccess(true);
                const timeoutId = setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                console.log(timeoutId);
            }
        }
    }
    const handleNextActive = () => {
        if (current=== activeAll.length - 1) {
            navigate(`/Course/CompleCourse/${idcourse}`);
        }
        else {
            navigate(`/learing/${next.id}/${idcourse}`);
            window.location.reload();
        }
    }
    return (
        <div style={{ flex: 0.70, height: 600 }}>
            {
                active &&
                <div class="px-5 py-5 bg-gray-100 rounded-b-lg dark:bg-gray-800">
                    <textarea id="editor" value={active.content} disabled rows={"20"} class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder=""
                        style={{ resize: 'none', maxHeight: 200, overflowY: 'auto' }}>
                    </textarea>
                    <div className="mt-5">
                        <div className="w-full flex">
                            <div className="w-1/2">
                                <div className="flex" style={{ height: "5vh" }}>
                                    <Select
                                        className="justify-start"
                                        placeholder="Chọn ngôn ngữ"
                                        style={{
                                            width: 150,
                                            marginBottom: 5,
                                        }}
                                        options={languProgram}
                                        defaultValue="cpp"
                                        onChange={(value) => {
                                            setLang(value)
                                            const selectedLanguage = languProgram.find(lang => lang.value === value);
                                            setCompileLanguage(selectedLanguage.label)
                                        }}
                                    />
                                    <Button
                                        className="bg-sky-500	text-white hover:bg-sky-300 ml-5"
                                        onClick={Submit}
                                    >
                                        Chạy
                                    </Button>
                                </div>
                                <Editor
                                    height="100vh"
                                    language={compileLanguage}
                                    theme="vs-dark"
                                    loading
                                    onChange={(value) => setCode(value)}
                                />
                            </div>
                            <div className="w-1/2">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-base font-bold ml-3"
                                    style={{ height: "5vh" }}
                                >
                                    Đầu vào:
                                </label>
                                <Input.TextArea
                                    style={{
                                        height: "50vh",
                                        resize: "none",
                                        backgroundColor: "#1E1E1E",
                                        color: "#FFFFFF",
                                    }}
                                    value={input}
                                    //onChange={(e) => setInput(e.target.value)}
                                />
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-base font-bold ml-3"
                                    style={{ height: "5vh" }}
                                >
                                    Đầu ra:
                                </label>
                                <Input.TextArea
                                    style={{
                                        height: "45vh",
                                        resize: "none",
                                        backgroundColor: "#1E1E1E",
                                        color: "#FFFFFF",
                                    }}
                                    readOnly
                                    value={output}
                                />
                            </div>
                        </div>
                    </div>
                    {
                        time < 60 ?
                            <div>
                                Thời gian mở giải thích còn: {60 - time} <br />
                                <span className="text-red-500" style={{ fontWeight: 'bold' }}>! Thoát khỏi trang web quá trình sẽ được lập lại</span>
                            </div> :
                            <textarea id="editor" value={active.explain} disabled rows={"20"} class=" mt-3 block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder=""
                                style={{ resize: 'none', maxHeight: 500, overflowY: 'auto' }}>
                            </textarea>
                    }
                    {
                        next &&
                        <button
                            class=" float-right middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true"
                            onClick={handleNextActive}
                        >
                            Bài học tiếp theo
                        </button>
                    }
                </div>
            }


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

export default LearingType3;