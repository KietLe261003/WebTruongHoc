import { Timestamp, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
//import { useNavigate } from "react-router-dom";
function CompleCourse() {
    const { idCourse } = useParams();
    const [checkRating, setCheckRating] = useState(true);
    const {currentUser} = useContext(AuthContext);

    const navigate = useNavigate();
    // useEffect(()=>{
    //     const getUser  = async ()=>{
    //         const docUser = await getDoc(doc(db, "users", currentUser.uid));
       
    //     }
    // },[])
    const [stars, setStars] = useState([false, false, false, false, false]);
    const [starUser,setStarUser]=useState(1);
    const [rating,setRating]=useState("Góp ý...");
    const handleStarHover = (index) => {
      const newStars = stars.map((star, i) => (i <= index ? true : false));
      setStars(newStars);
      setStarUser(index);
    };
  
    const handleStarClick = (index) => {
      const newStars = stars.map((star, i) => (i <= index ? true : false));
      setStars(newStars);
      setStarUser(index);
    };
    const handlSubmitRating = async ()=>{
        //alert("haha");
        try {
            const getCourse = await getDoc(doc(db,"course",idCourse));
            const docUser = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docUser.data().id;
            if(getCourse.exists())
            {
                const newstart = starUser+getCourse.data().rating;
                await updateDoc(doc(db,"course",idCourse),{
                    rating: newstart,
                    comment: arrayUnion({IdUser: idUser, star: starUser, content: rating})
                })
                setCheckRating(false);
            }
        } catch (error) {
            alert("Lỗi đánh giá");
            console.log(stars+" "+rating);
            console.log(error);
        }
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const phoneNumber = e.target[2].value;
        const Address = e.target[3].value;
        const reason = e.target[4].value;
        try {
            const certificate = await getDoc(doc(db, "certificate", idCourse));
            const docUser = await getDoc(doc(db, "users", currentUser.uid));
            const idUser = docUser.data().id;
            const time = Timestamp.now();
            if (!certificate.exists()) {
                await setDoc(doc(db, "certificate",idCourse), {
                    id: idCourse,
                    users: arrayUnion({ IdUser: idUser, name: name,email: email,phoneNumber: phoneNumber, address: Address, reason: reason,status: 0, time: time})
                });
                const getCourse = await getDoc(doc(db, "course",idCourse));
                if(getCourse.exists())
                {
                    await updateDoc(doc(db, "course",idCourse),{
                        numberCertificate: getCourse.data().numberCertificate+1
                    })
                }
                alert("Cảm ơn bạn đã đồng hành cùng khóa học của chúng tôi");
                navigate("/");
            }
            else {
                await updateDoc(doc(db, "certificate", idCourse), {
                    id: idCourse,
                    users: arrayUnion({ IdUser: idUser, name: name,email: email,phoneNumber: phoneNumber, address: Address,reason: reason,status: 0,time: time})
                });
                const getCourse = await getDoc(doc(db, "course",idCourse));
                if(getCourse.exists())
                {
                    await updateDoc(doc(db, "course",idCourse),{
                        numberCertificate: getCourse.data().numberCertificate+1
                    })
                }
                alert("Cảm ơn bạn đã đồng hành cùng khóa học của chúng tôi");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const closeRating =()=>{
        setCheckRating(false);
    }
    const [checkSend,setChekSend]=useState(0);
    useEffect(()=>{
        const unsub = onSnapshot(doc(db, "certificate", idCourse), async (i) => {
            if(i.exists())
            {
                const item = i.data().users;
                const docUser = await getDoc(doc(db,"users",currentUser.uid));
                const idUser = docUser.data().id;
                item.forEach((it)=>{
                    if(it.IdUser===idUser)
                    {
                        setChekSend(checkSend+1);
                    }
                })
            }
        });
        return ()=>{
            unsub();
        }
    },[idCourse,currentUser.uid,checkSend])
    return (
        <div class="relative flex items-top justify-center min-h-screen bg-white dark:bg-gray-900 sm:items-center sm:pt-0">
            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div class="mt-8 overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2">
                        {
                            checkRating && checkSend === 0 && 
                            <div class="p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
                                <div class="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
                                    <div class="px-12 py-5">
                                        <h2 class="text-gray-800 text-3xl font-semibold">Bạn cảm thấy thế nào sau khóa học của chúng tôi !</h2>
                                    </div>
                                    <div class="bg-gray-200 w-full flex flex-col items-center">
                                        <div class="flex flex-col items-center py-6 space-y-3">
                                            <span class="text-lg text-gray-800">Chất lượng khóa học ?</span>
                                            <div className="flex space-x-3">
                                                {stars.map((isYellow, index) => (
                                                    <button>
                                                        <svg
                                                            key={index}
                                                            className={`w-12 h-12 ${isYellow ? 'text-yellow-500' : 'text-gray-500'}`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            onMouseEnter={() => handleStarHover(index)} 
                                                            onClick={() => handleStarClick(index)}
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div class="w-3/4 flex flex-col">
                                            <textarea rows="3" value={rating} onChange={(e)=>{setRating(e.target.value)}} class="p-4 text-gray-500 rounded-xl resize-none"></textarea>
                                            <button onClick={handlSubmitRating}  class="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">Đánh giá</button>
                                        </div>
                                    </div>
                                    <div class="h-20 flex items-center justify-center">
                                        <button onClick={closeRating} class="text-gray-600">Maybe later</button>
                                    </div>
                                </div>
                            </div>
                        }
                        <div class="p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
                            <div class="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
                                <div class="px-12 pt-5">
                                    <h2 class="text-gray-800 text-3xl font-semibold">Vui lòng điền đầy đủ thông tin để nhận chứng chỉ !</h2>
                                </div>
                                <form  onSubmit={handleSubmit} class="p-6 flex flex-col justify-center">
                                    <div class="flex flex-col">
                                        <label for="name" class="hidden">Full Name</label>
                                        <input type="name" name="name" id="name" placeholder="Họ tên" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                    </div>

                                    <div class="flex flex-col mt-2">
                                        <label for="email" class="hidden">Email</label>
                                        <input type="email" name="email" id="email" placeholder="Email" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                    </div>

                                    <div class="flex flex-col mt-2">
                                        <label for="tel" class="hidden">Number</label>
                                        <input type="tel" name="tel" id="tel" placeholder="Số điện thoại" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                    </div>

                                    <div class="flex flex-col mt-2">
                                        <label for="address" class="hidden">Address</label>
                                        <input type="text" name="address" id="address" placeholder="Địa chỉ nhận" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                    </div>
                                    {
                                        checkSend >= 1 &&
                                        <div class="flex flex-col mt-2">
                                            <label for="address" class="hidden">Lý do</label>
                                            <input type="text" name="address" id="address" placeholder="Vui lòng điền lý do nếu như bạn muốn cấp lại" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
                                        </div>
                                    }
                                    <button type="submit" class="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleCourse;