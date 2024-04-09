import { Button, Select } from "antd";
import Editor from "@monaco-editor/react";
import React from "react";
import { useState } from "react";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

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
function UpdateActiveCode(props) {
    const activeUpdate= props.activeUpdate;
    const [lg, setLg] = useState(activeUpdate.langueCode);
    const [input, setInput] = useState(activeUpdate.input);
    const [output, setOutput] = useState("");
    const [code, setCode] = useState(activeUpdate.code);
    const [ans, setAns] = useState(activeUpdate.answer);
    const [compileLanguage, setCompileLanguage] = useState("cpp");
    const [nameActive,setNameActive]=useState(activeUpdate.nameActive)
    const [description, setDescription] = useState(activeUpdate.content); // Biến này để lưu mô tả
    const [explain,setExplain]=useState(activeUpdate.explain); // Biến này để lưu lời giải thích
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const timeUpdate = Timestamp.now();
            await updateDoc(doc(db,"active",activeUpdate.id),{
                nameActive: nameActive,
                content: description,
                code: code,
                input: input,
                answer: ans,
                explain: explain,
                langueCode: lg,
                timeUpdate: timeUpdate,
                type: 3
            })
            alert("Cập nhật thành công");
            window.location.reload();
        } catch (error) {
            alert("Lỗi tải bài lên");
            console.log("Lỗi nek: "+error);
        }
    }
    const submitCode = async () => {
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
                    language_id: lg,
                    cpu_time_limit: 1,
                    memory_limit: 262144,
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
            setOutput(jsonGetSolution.status.description);
        } else if (jsonGetSolution.stdout) {
            const output = atob(jsonGetSolution.stdout);
            setOutput(
                `Kết quả :\n\n${output}\n\nThời gian chạy : ${jsonGetSolution.time} giây\nBộ nhớ : ${jsonGetSolution.memory} kilobytes`
            );
            setAns(output);
        } else if (jsonGetSolution.stderr) {
            const error = atob(jsonGetSolution.stderr);

            setOutput(`Lỗi :${error}`);
        } else {
            const compilation_error = atob(jsonGetSolution.compile_output);
            setOutput(`Lỗi biên dịch :${compilation_error}`);
        }
    }
    return (
        <div style={{ maxHeight: 600 }}>
            {/* đây là form đăng nhập */}
            <form onSubmit={handleSubmit}> 
                <div class="grid md:grid-cols-1 grid-cols-1 gap-6">
                    <div class="md:col-span-2 w-full">
                        <input type="text" id="fname" name="fname" value={nameActive} onChange={(e)=>{setNameActive(e.target.value)}} placeholder="Tên hoạt động"
                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                        />
                    </div>
                    <div class="md:col-span-2 w-full">
                        <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div class="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
                                <div class="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                                    <div class="flex items-center space-x-1 sm:pr-4">
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                                        </button>
                                    </div>
                                    <div class="flex flex-wrap items-center space-x-1 sm:pl-4">
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                        </button>
                                        <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                <button type="button" data-tooltip-target="tooltip-fullscreen" class="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                </button>
                                <div id="tooltip-fullscreen" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                                    Show full screen
                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </div>
                            <div class="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                                <label for="editor" class="sr-only">Publish post</label>
                                <textarea id="editor" rows="15" class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Viết nộp dung bài tập" value={description} onInput={(e) => setDescription(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2">
                        <label for="subject" class="float-left block  font-normal text-gray-400 text-lg mr-3">Chọn ngôn ngữ:</label>
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
                                const selectedLanguage = languProgram.find(lang => lang.value === value);
                                setLg(value); setCompileLanguage(value); setCompileLanguage(selectedLanguage.label)
                            }}
                        />
                        <Button onClick={submitCode} className="flex float-right bg-blue-500">Run code</Button>
                    </div>
                    <Editor
                        height="40vh"
                        width="100%"
                        language={compileLanguage}
                        theme="vs-dark"
                        loading
                        value={code}
                        onChange={(value) => setCode(value)}
                    />
                    <div class="md:col-span-2 w-full">
                        <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div class="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                                <label for="editor" class="sr-only">Publish post</label>
                                <textarea id="editor" rows="15" class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 h-32"
                                    placeholder="Nhập đầu vào" value={input} onInput={(e) => setInput(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2 w-full">
                        <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div class="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                                <label for="editor" class="sr-only">Publish post</label>
                                <textarea id="editor" rows="15" class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 h-32"
                                    placeholder="Đầu ra vào" value={output} onInput={(e) => setOutput(e.target.value)} required disabled></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2 w-full">
                        <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div class="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                                <label for="editor" class="sr-only">Publish post</label>
                                <textarea id="editor" rows="15" class="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 h-32"
                                    placeholder="Đáp án và lời giải" value={explain} onChange={(e)=>{setExplain(e.target.value)}} required ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2">
                        <button
                            type="submit"
                            class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UpdateActiveCode;