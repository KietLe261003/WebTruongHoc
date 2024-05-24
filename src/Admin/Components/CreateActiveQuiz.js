import { Timestamp, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase";
import {v4 as uuid} from 'uuid';
function CreateActiveQuiz(props) {
    const idRoadMap = props.idRoadMap;
    const [questions, setQuestions] = useState([]);
    const [nameActive,setNameActive]=useState("");
    const [errFile,setErrFile]=useState(false);
    const handleAddQuiz = () => {
        const tmp = {
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            ans: "",
        };
        setQuestions([...questions, tmp]);
    }

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    }

    const handleDeleteQuiz = (indexToRemove) => {
        const updatedQuestions = questions.filter((item, index) => index !== indexToRemove);
        setQuestions(updatedQuestions);
    }
    const handleSubmit = async ()=>{
        const id = uuid();
        try {
            const timeUpdate = Timestamp.now();
            await setDoc(doc(db, "active", id), {
                id: id,
                idRoadMap: idRoadMap,
                nameActive: nameActive,
                timeUpdate: timeUpdate,
                timeCreate: timeUpdate,
                type: 5,
                listQuestion: questions
            })
            alert("Cập nhật thành công");
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    const handleFileChange = (f) => {
        const file = f;
        if(file)
        {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async () => {
              const tmp =[...reader.result];
              let c=0;
              let q ="";
              let op1="";
              let op2="";
              let op3="";
              let op4="";
              let ans="";
              tmp.forEach((item)=>{
                  if(item!=="!")
                  {
                    if(c===0)
                      q+=item;
                    else if(c===1)
                      op1+=item;
                    else if(c===2)
                      op2+=item;
                    else if(c===3)
                      op3+=item;
                    else if(c===4)
                      op4+=item;
                    else if(c===5)
                      ans+=item;
                  }
                  else
                  {
                      if(c===5)
                      {
                          const tmp = {
                            question: q,
                            option1: op1,
                            option2: op2,
                            option3: op3,
                            option4: op4,
                            ans: ans,
                          };
                          const dt = questions;
                          dt.push(tmp)
                          //console.log(tmp);
                          setQuestions([...dt]);
                          c=0;
                          q ="";
                          op1="";
                          op2="";
                          op3="";
                          op4="";
                          ans="";
                      }
                      else
                      c++;
                  }
              })
            };
            reader.onerror = () => {
              setErrFile("Lỗi đọc file");
            };
          };
        }
    function checkQuestionAcp(item) {
        if(item.option1===item.ans)
            return true;
        else if(item.option2===item.ans)
            return true;
        else if(item.option3===item.ans)
            return true;
        else if(item.option4===item.ans)
            return true;
        else
        {
            console.log(item);
            // const dt=questionWrong;
            // dt.push(item);
            // setQuestionWrong(dt);
            return false;
        }
    }
    return (
        <div style={{ maxHeight: 600, padding: "20px" }}>
            <div class="md:col-span-2 w-full">
                <input type="text" id="fname" value={nameActive} onChange={(e)=>{setNameActive(e.target.value)}} name="fname" placeholder="Tên hoạt động"
                    class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                />
                <p>Tải bằng file</p>
                <input type="file" onChange={(e) => handleFileChange(e.target.files[0])}></input>
                {errFile && <span className=" text-red-500">{errFile}</span>}
            </div>
            {
                questions.map((item, index) => (
                    <div className=" mb-3" key={index}>
                        <span>Câu hỏi số: {index+1}</span>
                        <div className="w-full bg-gray-400 p-8 rounded-md shadow-md">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${index}`}>Tên câu hỏi</label>
                                <input 
                                    value={questions[index].question} 
                                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    type="text" 
                                    id={`question-${index}`} 
                                    name={`question-${index}`} 
                                    placeholder="Tên câu hỏi" 
                                />
                            </div>
                            {/* Các trường thông tin khác tương tự */}
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Câu trả lời 1</label>
                                <input value={questions[index].option1} onChange={(e)=>{handleQuestionChange(index,'option1',e.target.value)}} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    type="text" id="op1" name="text" placeholder="Câu trả lời 1" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Câu trả lời 2</label>
                                <input value={questions[index].option2} onChange={(e)=>{handleQuestionChange(index,'option2',e.target.value)}} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    type="text" id="op2" name="text" placeholder="Câu trả lời 2" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Câu trả lời 3</label>
                                <input value={questions[index].option3} onChange={(e)=>{handleQuestionChange(index,'option3',e.target.value)}} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    type="text" id="op3" name="text" placeholder="Câu trả lời 3" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Câu trả lời 4</label>
                                <input value={questions[index].option4} onChange={(e)=>{handleQuestionChange(index,'option4',e.target.value)}} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    type="text" id="op4" name="text" placeholder="Câu trả lời 4" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Đáp án đúng</label>
                                <input value={questions[index].ans} onChange={(e)=>{handleQuestionChange(index,'ans',e.target.value)}} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    type="text" id="ans" name="text" placeholder="Đáp án đúng" />
                            </div>
                            {checkQuestionAcp(item)===false && <span className=" text-red-500">Chưa có câu trả lời nào trùng với đáp án</span>}
                            <button
                                onClick={() => handleDeleteQuiz(index)}
                                type="button"
                                className="py-3 text-base font-medium rounded text-white bg-red-500 w-full hover:bg-red-700 transition duration-300">
                                Xóa
                            </button>
                        </div>
                    </div>
                ))
            }
            <div className="md:col-span-2 mb-2">
                <button
                    onClick={handleAddQuiz}
                    type="button"
                    className="py-3 text-base font-medium rounded text-white bg-green-500 w-full hover:bg-green-700 transition duration-300">
                    Thêm câu hỏi 
                </button>
            </div>
            <div className="md:col-span-2 mb-3">
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">
                    Tạo 
                </button>
            </div>
        </div>
    );
}

export default CreateActiveQuiz;
